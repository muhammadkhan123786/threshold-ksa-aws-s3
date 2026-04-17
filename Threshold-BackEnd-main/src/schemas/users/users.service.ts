import {
    ConflictException,
    HttpStatus,
    Injectable,
    InternalServerErrorException,
    NotFoundException,
    UnauthorizedException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Raw, Repository, UpdateResult } from "typeorm";
import { compare, hash } from "bcrypt";
import { Request } from "express";
import { User } from "src/entities/user.entity";
import { CreateUserDto } from "src/dto/users/create-user.dto";
import { UpdateUserDto } from "src/dto/users/update-user.dto";
import { UserFields } from "src/enums/tables-data.enum";
import { FullTokenPayload } from "src/types/token-payload.type";
import { UserRole } from "src/enums/users.enum";
import CustomResponseType from "src/types/customResponseType";
import { FilteredTermDataType, GetAllProps } from "src/types/getOperators";
import { FilterOperator } from "src/enums/filters";
import {
    errorRes,
    forbiddenRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { filteredGetQuery } from "src/middlewares/filters";
import { emailValidator } from "src/middlewares/validators";
import { AcademiesService } from "../academies/academies.service";
import { AuthUtil } from "src/lib/helpers/auth.util";
import { CreateCoachDto } from "src/dto/coaches/create-coach.dto";
import { Coach } from "src/entities/coach.entity";
import { Academy } from "src/entities/academy.entity";
import { MailerService } from "src/mailer/mailer.service";
import { I18nService } from "src/i18n/i18n.service";
import { Branch } from "src/entities/branch.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Coach)
        private coachRepository: Repository<Coach>,
        private readonly academiesService: AcademiesService,
        private readonly mailerService: MailerService,
        private readonly i18nService: I18nService
    ) {}

    async getAdminManagersByBranchAndAcademy(
        branchId: string
    ): Promise<CustomResponseType<User[]>> {
        try {
            const adminManagers = await this.userRepository.find({
                where: {
                    role: UserRole.ADMIN_MANAGER,
                    branch: { id: branchId },
                },
                relations: ["academy", "branch"],
            });

            return foundRes(
                this.i18nService.translate("auth.admin_managers_found"),
                adminManagers
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }
    async createAdminManager(
        createUserDto: CreateUserDto,
        user: any
    ): Promise<CustomResponseType<User>> {
        try {
            const res = await this.userRepository.manager.transaction(
                async (transactionalEntityManager: EntityManager) => {
                    await this.checkForUniqueness(
                        this.uniqueFieldsArray({
                            username: createUserDto.username,
                            email: createUserDto.email,
                        })
                    );

                    const academyEntity =
                        await transactionalEntityManager.findOne(Academy, {
                            where: { id: user.payload.academy.id },
                        });

                    if (!academyEntity) {
                        return notFoundRes(
                            this.i18nService.translate("academy.not_found")
                        );
                    }

                    const branchEntity =
                        await transactionalEntityManager.findOne(Branch, {
                            where: { id: createUserDto.branch_id },
                        });

                    if (!branchEntity) {
                        return notFoundRes(
                            this.i18nService.translate("branch.not_found")
                        );
                    }

                    const hashedPassword = await AuthUtil.hashPassword(
                        createUserDto.password
                    );

                    const newUser = transactionalEntityManager.create(User, {
                        ...createUserDto,
                        academy: academyEntity,
                        branch: branchEntity,
                        role: UserRole.ADMIN_MANAGER,
                        password: hashedPassword,
                    });

                    const savedUser = await transactionalEntityManager.save(
                        User,
                        newUser
                    );

                    return foundRes<User>(
                        this.i18nService.translate(
                            "auth.admin_manager_created"
                        ),
                        savedUser
                    );
                }
            );

            return res;
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async getAdminManagers(): Promise<CustomResponseType<User[]>> {
        try {
            const adminManagers = await this.userRepository.find({
                where: { role: UserRole.ADMIN_MANAGER },
            });
            return foundRes<User[]>(
                this.i18nService.translate("auth.admin_managers_found"),
                adminManagers
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async checkUserCredentials({
        identifier,
        password = "",
        isOnlyEmail = false,
    }: {
        identifier: { type: "email" | "username"; value: string };
        password?: string;
        isOnlyEmail?: boolean;
    }): Promise<CustomResponseType<User>> {
        try {
            const identifierField =
                identifier.type === "email" ? "email" : "username";
            const identifierValue = identifier.value.toLowerCase();

            console.log(
                "identifieridentifieridentifier",
                identifier,
                identifierField
            );

            const user = await this.userRepository.findOne({
                where: {
                    [identifierField]: Raw(
                        (alias) => `LOWER(${alias}) = LOWER(:value)`,
                        { value: identifierValue }
                    ),
                },
                relations: ["branch", "academy", "academy.branches"],
            });
            if (!user) {
                return notFoundRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }

            if (
                !user.isApproved &&
                user.role !== UserRole.ACADEMY_COORDINATOR
            ) {
                return forbiddenRes(
                    this.i18nService.translate("auth.account_not_approved")
                );
            }

            if (isOnlyEmail) {
                return foundRes(
                    this.i18nService.translate("auth.user_found"),
                    user
                );
            }

            if (!(await compare(password, user.password))) {
                return forbiddenRes(
                    this.i18nService.translate("auth.invalid_password")
                );
            }

            return foundRes(
                this.i18nService.translate("auth.user_found"),
                user
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    private checkForUniqueness = async (
        items: {
            field: UserFields;
            filteredTerm: {
                dataType: FilteredTermDataType;
                value: any;
            };
            filterOperator: FilterOperator;
            isUpdate?: boolean;
        }[]
    ) => {
        const result: any[] = [];

        await Promise.all(
            items.map(async (item) => {
                if (!item) return;

                const obj = await this.getUsers({
                    conditions: [item],
                });

                if (obj?.payload.length > (item.isUpdate ? 1 : 0)) {
                    result.push(item.field);
                }
            })
        );

        if (result.length > 0) {
            throw new Error(
                this.i18nService.translate(`auth.${result[0]}_already_assigned`)
            );
        }
    };

    private userDataFilter<returnType>(user: User): returnType {
        const { password, token, ...rest } = user;
        return rest as returnType;
    }

    private uniqueFieldsArray = ({
        username,
        email,
        isUpdate,
    }: {
        username: string;
        email: string;
        isUpdate?: boolean;
    }) => [
        {
            field: UserFields.USERNAME,
            filteredTerm: {
                dataType: FilteredTermDataType.STRING,
                value: username,
            },
            filterOperator: FilterOperator.STRING_EQUALS,
            isUpdate: !!isUpdate,
        },
        {
            field: UserFields.EMAIL,
            filteredTerm: {
                dataType: FilteredTermDataType.STRING,
                value: email,
            },
            filterOperator: FilterOperator.STRING_EQUALS,
            isUpdate: !!isUpdate,
        },
    ];

    getUserTokenData(req: Request): FullTokenPayload | null {
        if (req && req["user"]) {
            if (Object.keys(req["user"]).length === 0) {
                return null;
            }

            const userTokenData = {
                ...req["user"],
            } as FullTokenPayload;

            userTokenData["expiredIn"] = `${Math.floor(
                (userTokenData.exp - userTokenData.iat) / 3600
            )} Hours`;

            return userTokenData;
        } else {
            return null;
        }
    }

    async getUsers({
        withPass = false,
        ...query
    }: GetAllProps<UserFields> & { withPass?: boolean }): Promise<
        CustomResponseType<User[]>
    > {
        try {
            const findQuery = filteredGetQuery(query);

            const response = await this.userRepository.find(findQuery);
            const updatedUsers = response.map((user) => {
                return withPass ? user : this.userDataFilter<User>(user);
            });
            return foundRes<User[]>(
                response.length
                    ? this.i18nService.translate("auth.users_found")
                    : this.i18nService.translate("auth.users_list_empty"),
                updatedUsers,
                response.length
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async getUserById(id: string): Promise<CustomResponseType<User>> {
        try {
            const response = await this.userRepository.findOne({
                where: {
                    id,
                },
                relations: ["branch", "academy"],
            });
            if (!response)
                return notFoundRes(
                    this.i18nService.translate("auth.user_not_found")
                );

            return foundRes<User>(
                this.i18nService.translate("auth.user_found"),
                this.userDataFilter<User>(response)
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async getTokenById(id: string): Promise<CustomResponseType<string>> {
        try {
            const response = await this.userRepository.findOneBy({ id });
            if (!response) {
                return notFoundRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }
            return foundRes<string>(
                this.i18nService.translate("auth.token_found"),
                response?.token
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async createUser(
        createUserDto: CreateUserDto,
        userTokenData: FullTokenPayload
    ): Promise<CustomResponseType<User>> {
        try {
            const { password, academy: academyId, ...rest } = createUserDto;

            const userObj = { ...rest };

            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes(
                        this.i18nService.translate("auth.academy_not_found")
                    );
                }
                userObj["academy"] = academy.payload;
            }

            if (
                createUserDto.role === UserRole.ADMIN &&
                (!userTokenData || userTokenData.role === UserRole.MEMBER)
            ) {
                return forbiddenRes(
                    this.i18nService.translate("auth.unauthorized_create_admin")
                );
            }

            await this.checkForUniqueness(
                this.uniqueFieldsArray({
                    username: createUserDto.username,
                    email: createUserDto.email,
                })
            );

            const newUser = this.userRepository.create({
                ...userObj,
                password: await hash(password, 12),
            });
            const response = await this.userRepository.save(newUser);

            return newInstanceRes<User>(
                this.i18nService.translate("auth.user_created_successfully"),
                this.userDataFilter<User>(response)
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }
    async updateUser(
        id: string,
        updateUserDto: UpdateUserDto,
        userTokenData: FullTokenPayload
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const { academy: academyId, ...rest } = updateUserDto;

            const userObj = { ...rest };

            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes(
                        this.i18nService.translate("auth.academy_not_found")
                    );
                }
                userObj["academy"] = academy.payload;
            }

            if (Object.keys(updateUserDto).length === 0) {
                return errorRes(
                    this.i18nService.translate("auth.invalid_request_body")
                );
            }

            const isAdminAccount =
                userTokenData && userTokenData.role === UserRole.ADMIN;

            const user = await this.getUserById(id);
            if (user.status !== 200) {
                return notFoundRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }

            if (userTokenData && !isAdminAccount) {
                if (updateUserDto?.role) {
                    return forbiddenRes(
                        this.i18nService.translate(
                            "auth.unauthorized_update_role"
                        )
                    );
                }
                if (updateUserDto?.password) {
                    return forbiddenRes(
                        this.i18nService.translate(
                            "auth.unauthorized_update_password"
                        )
                    );
                }
                if (userTokenData?.userId !== id) {
                    return forbiddenRes(
                        this.i18nService.translate(
                            "auth.unauthorized_update_account"
                        )
                    );
                }
            }

            await this.checkForUniqueness(
                this.uniqueFieldsArray({
                    username: updateUserDto.username,
                    email: updateUserDto.email,
                    isUpdate: true,
                })
            );

            const response = await this.userRepository.update({ id }, userObj);

            return newInstanceRes<UpdateResult>(
                this.i18nService.translate("auth.user_updated_successfully"),
                response
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async updatePassword(
        identifier: string,
        newPassword: string
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            const user = await this.checkUserCredentials({
                identifier: {
                    type: emailValidator(identifier) ? "email" : "username",
                    value: identifier,
                },
                isOnlyEmail: true,
            });
            if (user.status !== 200) {
                return { ...user, payload: null };
            }

            const response = await this.userRepository.update(
                {
                    id: user.payload.id,
                },
                {
                    password: await hash(newPassword, 12),
                    token: "",
                }
            );

            return newInstanceRes<UpdateResult>(
                this.i18nService.translate(
                    "auth.password_updated_successfully"
                ),
                response
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async updateToken(
        identifier: string,
        token: string
    ): Promise<CustomResponseType<UpdateResult>> {
        const user = await this.checkUserCredentials({
            identifier: {
                type: emailValidator(identifier) ? "email" : "username",
                value: identifier,
            },
            isOnlyEmail: true,
        });
        if (user.status !== 200) {
            return { ...user, payload: null };
        }

        const response = await this.userRepository.update(
            {
                id: user.payload.id,
            },
            {
                token,
            }
        );

        return newInstanceRes<UpdateResult>(
            this.i18nService.translate("auth.token_updated_successfully"),
            response
        );
    }

    async getPendingApprovalUsers(): Promise<
        CustomResponseType<Omit<User, "password">[]>
    > {
        try {
            const users = await this.userRepository
                .createQueryBuilder("user")
                .where("user.role != :role", {
                    role: UserRole.ACADEMY_COORDINATOR,
                })
                .orderBy("user.isApproved", "ASC")
                .addOrderBy("user.createdAt", "DESC")
                .getMany();

            return foundRes(
                this.i18nService.translate(
                    "auth.pending_approval_users_fetched"
                ),
                users
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    async toggleApprovalStatus(id: string): Promise<CustomResponseType<User>> {
        try {
            const user = await this.getUserById(id);
            if (user.status !== 200) {
                return notFoundRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }

            user.payload.isApproved = !user.payload.isApproved;

            const updatedUser = await this.userRepository.save(user.payload);

            await this.mailerService.sendApprovalEmail(
                user.payload.email,
                user.payload.username,
                user.payload.isApproved
            );
            return newInstanceRes<User>(
                this.i18nService.translate("auth.user_approval_status_updated"),
                this.userDataFilter<User>(updatedUser)
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }
    async createUserForCoach(
        createCoachDto: CreateCoachDto
    ): Promise<CustomResponseType<any>> {
        try {
            const {
                email,
                password,
                username,
                academy,
                branch,
                avatar,
                ...coachData
            } = createCoachDto;

            const existingUserByEmail = await this.userRepository.findOne({
                where: { email },
            });
            if (existingUserByEmail) {
                throw new ConflictException(
                    this.i18nService.translate("auth.email_exists")
                );
            }

            const existingUserByUsername = await this.userRepository.findOne({
                where: { username },
            });
            if (existingUserByUsername) {
                throw new ConflictException(
                    this.i18nService.translate("auth.username_exists")
                );
            }

            // Hash the password
            const hashedPassword = await AuthUtil.hashPassword(password);

            return await this.userRepository.manager.transaction(
                async (transactionalEntityManager) => {
                    if (!academy) {
                        throw new ConflictException(
                            this.i18nService.translate("auth.academy_not_found")
                        );
                    }

                    const user = this.userRepository.create({
                        email,
                        password: hashedPassword,
                        username,
                        role: UserRole.COACH,
                        avatar,
                        academy,
                        branch,
                    });
                    const savedUser =
                        await transactionalEntityManager.save(user);

                    const coach = this.coachRepository.create({
                        ...coachData,
                        user: savedUser,
                        academy,
                        branch,
                    });

                    const savedCoach =
                        await transactionalEntityManager.save(coach);

                    return {
                        status: HttpStatus.CREATED,
                        payload: {
                            user: savedUser,
                            coach: savedCoach,
                        },
                        message: this.i18nService.translate(
                            "auth.coach_and_user_created_successfully"
                        ),
                    };
                }
            );
        } catch (error) {
            if (error instanceof ConflictException) {
                return {
                    status: HttpStatus.CONFLICT,
                    payload: error.message,
                    message: error.message,
                };
            }
            return this.handleErrorWithTranslation(error);
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            const user = await this.userRepository.findOne({
                where: { email },
                relations: ["branch", "academy"],
            });
            return user || null;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async updateUserPassword(
        id: string,
        updateUserDto: UpdateUserDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            if (!updateUserDto.password) {
                return errorRes(
                    this.i18nService.translate(
                        "auth.password_required_for_update"
                    )
                );
            }

            const user = await this.getUserById(id);
            if (user.status !== 200) {
                return notFoundRes(
                    this.i18nService.translate("auth.user_not_found")
                );
            }

            updateUserDto.password = await AuthUtil.hashPassword(
                updateUserDto.password
            );

            const response = await this.userRepository.update(
                { id },
                { password: updateUserDto.password }
            );

            return newInstanceRes<UpdateResult>(
                this.i18nService.translate(
                    "auth.password_updated_successfully"
                ),
                response
            );
        } catch (error) {
            return this.handleErrorWithTranslation(error);
        }
    }

    private handleErrorWithTranslation(error: any): CustomResponseType<any> {
        console.error(error);

        const errorMessage = error?.response?.message || error.message;

        if (errorMessage) {
            return errorRes(errorMessage);
        }

        if (error instanceof UnauthorizedException) {
            return errorRes(this.i18nService.translate("auth.unauthorized"));
        } else if (error instanceof InternalServerErrorException) {
            return errorRes(
                this.i18nService.translate("auth.internal_server_error")
            );
        } else {
            return errorRes(this.i18nService.translate("auth.unknown_error"));
        }
    }

    private async getAcademyEntity(
        academyId?: string
    ): Promise<Academy | null> {
        if (!academyId) {
            return null;
        }

        const academyResponse =
            await this.academiesService.getAcademyById(academyId);

        if (academyResponse.status !== 200 || !academyResponse.payload) {
            throw new NotFoundException(
                this.i18nService.translate("auth.academy_not_found")
            );
        }

        return academyResponse.payload;
    }
}
