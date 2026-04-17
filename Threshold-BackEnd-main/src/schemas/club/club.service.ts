import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Academy } from "../../entities/academy.entity";
import CustomResponseType from "src/types/customResponseType";
import {
    foundRes,
    newInstanceRes,
    deletedRes,
    notFoundRes,
    errorRes,
} from "src/lib/responses/restResponse";
import { AcademyType } from "src/enums/appType.enum";
import { CreateClubDto } from "src/dto/club/create-club.dto";
import { S3Service } from "src/s3/s3.service";
import { UpdateClubDto } from "src/dto/club/update-club.dto";

@Injectable()
export class ClubService {
    private readonly logger = new Logger(ClubService.name);

    constructor(
        @InjectRepository(Academy)
        private readonly academyRepository: Repository<Academy>,
        private readonly s3Service: S3Service
    ) {}

    async getClubs(search?: string): Promise<CustomResponseType<Academy[]>> {
        try {
            this.logger.log(`Fetching clubs with search: ${search || "None"}`);
            const query = this.academyRepository
                .createQueryBuilder("club")
                .where("club.type = :type", { type: AcademyType.CLUB });

            if (search) {
                query.andWhere("club.name LIKE :search", {
                    search: `%${search}%`,
                });
            }

            const clubs = await query.getMany();
            this.logger.log(`Fetched ${clubs.length} clubs successfully`);
            return foundRes("Clubs fetched successfully", clubs);
        } catch (error) {
            this.logger.error("Error fetching clubs", error.stack);
            return errorRes(error);
        }
    }

    async getClubById(id: string): Promise<CustomResponseType<Academy>> {
        try {
            this.logger.log(`Fetching club with ID: ${id}`);
            const club = await this.academyRepository.findOne({
                where: { id },
            });

            if (!club) {
                this.logger.warn(`Club with ID "${id}" not found`);
                return notFoundRes(`Club with ID "${id}" not found`);
            }

            if (club.avatarUrl) {
                try {
                    club.avatarUrl = await this.s3Service.getFileUrl(
                        club.avatarUrl
                    );
                    this.logger.log(
                        `Signed URL generated for avatar: ${club.avatarUrl}`
                    );
                } catch (error) {
                    this.logger.warn(
                        `Failed to generate signed URL for avatar: ${club.avatarUrl}`,
                        error.stack
                    );
                }
            }

            this.logger.log(`Fetched club with ID: ${id} successfully`);
            return foundRes("Club fetched successfully", club);
        } catch (error) {
            this.logger.error(
                `Error fetching club with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }

    private generateS3Path(clubName: string): string {
        return `clubs/${clubName}-${Date.now()}/avatar.png`;
    }

    async createClub(
        createDto: CreateClubDto,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Academy>> {
        try {
            this.logger.log(`Creating club with name: ${createDto.name}`);
            createDto.type = AcademyType.CLUB;

            if (avatar) {
                const s3Path = this.generateS3Path(createDto.name);
                const avatarUrl = await this.s3Service.uploadFile(
                    s3Path,
                    avatar
                );
                createDto.avatarUrl = avatarUrl;
            }

            const newClub = this.academyRepository.create(createDto);
            const savedClub = await this.academyRepository.save(newClub);

            this.logger.log(`Club created with ID: ${savedClub.id}`);
            return newInstanceRes("Club created successfully", savedClub);
        } catch (error) {
            this.logger.error("Error creating club", error.stack);
            return errorRes(error);
        }
    }

    async updateClub(
        id: string,
        updateDto: UpdateClubDto,
        avatar?: Express.Multer.File
    ): Promise<CustomResponseType<Academy>> {
        try {
            this.logger.log(`Updating club with ID: ${id}`);
            const club = await this.academyRepository.findOne({
                where: { id },
            });

            if (!club) {
                this.logger.warn(`Club with ID "${id}" not found`);
                return notFoundRes(`Club with ID "${id}" not found`);
            }

            if (avatar) {
                const s3Path = this.generateS3Path(updateDto.name || club.name);
                const newAvatarUrl = await this.s3Service.uploadFile(
                    s3Path,
                    avatar
                );

                if (club.avatarUrl) {
                    await this.s3Service.deleteFile(club.avatarUrl);
                }

                updateDto.avatarUrl = newAvatarUrl;
            }

            Object.assign(club, updateDto);
            const updatedClub = await this.academyRepository.save(club);

            this.logger.log(`Club with ID: ${id} updated successfully`);
            return foundRes("Club updated successfully", updatedClub);
        } catch (error) {
            this.logger.error(
                `Error updating club with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }

    async deleteClub(id: string): Promise<CustomResponseType<null>> {
        try {
            this.logger.log(`Deleting club with ID: ${id}`);
            const club = await this.academyRepository.findOne({
                where: { id, type: AcademyType.CLUB },
            });

            if (!club) {
                this.logger.warn(`Club with ID "${id}" not found`);
                return notFoundRes(`Club with ID "${id}" not found`);
            }

            await this.academyRepository.remove(club);

            this.logger.log(`Club with ID: ${id} deleted successfully`);
            return deletedRes("Club deleted successfully", null);
        } catch (error) {
            this.logger.error(
                `Error deleting club with ID: ${id}`,
                error.stack
            );
            return errorRes(error);
        }
    }
}
