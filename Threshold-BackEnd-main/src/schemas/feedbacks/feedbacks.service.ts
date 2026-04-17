import { AcademiesService } from "../academies/academies.service";
import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { DeleteResult, Repository, UpdateResult } from "typeorm";
import { Feedback } from "../../entities/feedback.entity";
import { CreateFeedbackDto } from "../../dto/feedbacks/create-feedback.dto";
import { UpdateFeedbackDto } from "../../dto/feedbacks/update-feedback.dto";
import { FeedbackFields } from "../../enums/tables-data.enum";
import { GetAllProps, GetOneProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { filteredGetQuery } from "src/middlewares/filters";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";
import { RELATIONS } from "src/lib/constants/table-relations";
import { User } from "src/entities/user.entity";
import { S3Service } from "src/s3/s3.service";

@Injectable()
export class FeedbacksService {
    private readonly logger = new Logger(FeedbacksService.name);

    constructor(
        @InjectRepository(Feedback)
        private readonly feedbackRepository: Repository<Feedback>,
        // ----- external services -----
        private readonly academiesService: AcademiesService,
        private readonly s3Service: S3Service
    ) {}

    // --- Basic REST APIs ---

    async getFeedbacks(
        query: GetAllProps<FeedbackFields>
    ): Promise<CustomResponseType<Feedback[]>> {
        try {
            const findQuery = filteredGetQuery(query);
            const response = await this.feedbackRepository.find(findQuery);

            return foundRes(
                response.length
                    ? "Feedbacks have been found"
                    : "Feedbacks list is empty",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async getFeedbackById(
        id: string,
        query: GetOneProps = { descendants: [] }
    ): Promise<CustomResponseType<Feedback>> {
        try {
            const response = await this.feedbackRepository.find({
                where: { id },
                relations: [
                    ...RELATIONS.feedback.manyToOne,
                    ...query?.descendants,
                ],
            });

            if (!response) return notFoundRes("Feedback does not exist");

            return foundRes("Feedback has been found", response[0]);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createFeedback(
        createFeedbackDto: CreateFeedbackDto
    ): Promise<CustomResponseType<Feedback>> {
        try {
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_CREATE ---
                academy: academyId,
                ...rest
            } = createFeedbackDto;

            const feedbackObj = { ...rest };

            // --- Table ID check - create ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                feedbackObj["academy"] = academy.payload;
            } else {
                return errorRes("Academy ID was not provided");
            }

            // ----------------------

            // create the object and save it in the DB
            const newFeedback = this.feedbackRepository.create(feedbackObj);
            const response = await this.feedbackRepository.save(newFeedback);
            // --- Post-response - create ---

            // ----------------------
            // return the response
            return newInstanceRes<Feedback>(
                "Feedback has been created successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async createClubFeedback(
        createFeedbackDto: CreateFeedbackDto,
        avatar: Express.Multer.File,
        user: User
    ): Promise<CustomResponseType<Feedback>> {
        try {
            this.logger.log("Starting to create club feedback");

            const { ...rest } = createFeedbackDto;
            const feedbackObj = { ...rest };

            const academyId = (user as any)?.payload?.academy?.id;
            if (!academyId) {
                this.logger.warn("No academy found in user payload");
                return errorRes("No academy found in user");
            }

            const academy =
                await this.academiesService.getAcademyById(academyId);
            if (academy.status !== 200) {
                this.logger.warn(`Academy with ID ${academyId} doesn't exist`);
                return notFoundRes("Academy doesn't exist");
            }
            feedbackObj["academy"] = academy.payload.id;

            if (avatar) {
                this.logger.log("Uploading avatar to S3");
                const uploadResult = await this.s3Service.uploadFile(
                    "feedbacks/avatars",
                    avatar
                );
                if (!uploadResult) {
                    this.logger.error("Failed to upload avatar");
                    return errorRes("Failed to upload avatar");
                }
                feedbackObj["avatar"] = uploadResult;
            }

            this.logger.log("Creating new feedback entry in the database");
            const newFeedback = this.feedbackRepository.create({
                ...feedbackObj,
                academy: academy.payload,
            });
            const response = await this.feedbackRepository.save(newFeedback);

            this.logger.log("Feedback created successfully");
            return newInstanceRes<Feedback>(
                "Feedback has been created successfully",
                response
            );
        } catch (error) {
            this.logger.error("Error creating club feedback", error.stack);
            return errorRes(error.message);
        }
    }

    async updateFeedback(
        id: string,
        updateFeedbackDto: UpdateFeedbackDto
    ): Promise<CustomResponseType<UpdateResult>> {
        try {
            // check if the id exists
            const feedback = await this.getFeedbackById(id);
            if (!feedback) {
                return notFoundRes(`Feedback does not exist`);
            }
            // deconstruction
            const {
                // --- DUMMY_TABLE_NAME_UPDATE ---
                academy: academyId,
                ...rest
            } = updateFeedbackDto;

            const feedbackObj = { ...rest };

            // --- Table ID check - update ---
            if (academyId) {
                const academy =
                    await this.academiesService.getAcademyById(academyId);
                if (academy.status !== 200) {
                    return notFoundRes("Academy doesn't exist");
                }
                feedbackObj["academy"] = academy.payload;
            }

            // ----------------------

            // create the object and save it in the DB
            const response = await this.feedbackRepository.update(
                {
                    id,
                },
                feedbackObj
            );
            // --- Post-response - update ---

            // ----------------------
            // return the response
            return newInstanceRes<UpdateResult>(
                "Feedback has been updated successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteAllFeedbacks(): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.feedbackRepository.query(
                `TRUNCATE TABLE "feedback" CASCADE;`
            );

            return deletedRes("Feedbacks data are wiped out", response);
        } catch (error) {
            return errorRes(error.message);
        }
    }

    async deleteFeedback(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const response = await this.feedbackRepository.delete(id);

            if (!response) {
                return notFoundRes("Feedback does not exist");
            }

            return deletedRes(
                "Feedback has been deleted successfully",
                response
            );
        } catch (error) {
            return errorRes(error.message);
        }
    }

    // --- Relational REST APIs ---
}
