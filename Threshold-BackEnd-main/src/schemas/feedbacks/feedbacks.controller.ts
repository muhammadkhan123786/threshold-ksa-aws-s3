import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiBody,
    ApiConsumes,
    ApiOperation,
    ApiResponse,
} from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { FeedbacksService } from "./feedbacks.service";
import { Feedback } from "../../entities/feedback.entity";
import { CreateFeedbackDto } from "../../dto/feedbacks/create-feedback.dto";
import { UpdateFeedbackDto } from "../../dto/feedbacks/update-feedback.dto";
import { FeedbackFields } from "../../enums/tables-data.enum";
import CustomResponseType from "src/types/customResponseType";
import {
    ControllerWrapper,
    EditorsWrapper,
    GetAllByQuery,
} from "src/decorators";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { GetAllProps, GetOneProps } from "src/types/getOperators";
import { GetOneByQuery } from "src/decorators/getBy.decorator";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { GetUser } from "src/auth/decorators/get-user.decorator";
import { User } from "src/entities/user.entity";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { SwaggerCreateClubFeedback } from "./swagger.tags";

const transferMapping: NewInstanceTransformer = {};

@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("feedbacks")
export class FeedbacksController {
    constructor(private readonly feedbacksService: FeedbacksService) {}

    // --- Basic REST endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: FeedbackFields,
        descendants: [
            ...RELATIONS.feedback.oneToMany,
            ...RELATIONS.feedback.manyToOne,
            ...RELATIONS.feedback.manyToMany,
        ],
    })
    async getFeedbacks(
        @Query(
            new GetAllPipe(FeedbackFields, [
                ...RELATIONS.feedback.manyToOne,
                ...RELATIONS.feedback.manyToMany,
            ])
        )
        query: GetAllProps<FeedbackFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Feedback[]> =
            await this.feedbacksService.getFeedbacks(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @GetOneByQuery({
        summary: "get a single feedback using its ID",
        descendants: [
            ...RELATIONS.feedback.oneToMany,
            ...RELATIONS.feedback.manyToMany,
        ],
    })
    async getFeedbackById(
        @Param("id") id: string,
        @Query(
            new GetAllPipe(
                FeedbackFields,
                [
                    ...RELATIONS.feedback.manyToOne,
                    ...RELATIONS.feedback.manyToMany,
                ],
                "getOne"
            )
        )
        query: GetOneProps,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Feedback> =
            await this.feedbacksService.getFeedbackById(id, query);

        return res.status(response.status).json(response);
    }

    @Post("/club")
    @SwaggerCreateClubFeedback()
    @UseInterceptors(FileInterceptor("avatar"))
    async createClubFeedback(
        @Body() createFeedbackDto: CreateFeedbackDto,
        @UploadedFile() avatar: Express.Multer.File,
        @Res() res: Response,
        @GetUser() user: User
    ) {
        const response: CustomResponseType<Feedback> =
            await this.feedbacksService.createClubFeedback(
                createFeedbackDto,
                avatar,
                user
            );

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateFeedbackDto, "create a new feedback")
    async createFeedback(
        @Body(new NewInstancePipe(transferMapping))
        createFeedbackDto: CreateFeedbackDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Feedback> =
            await this.feedbacksService.createFeedback(createFeedbackDto);

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateFeedbackDto, "update a feedback")
    async updateFeedback(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateFeedbackDto: UpdateFeedbackDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.feedbacksService.updateFeedback(id, updateFeedbackDto);

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all feedbacks" })
    async deleteAllFeedbacks(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.feedbacksService.deleteAllFeedbacks();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a feedback" })
    async deleteFeedback(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.feedbacksService.deleteFeedback(id);

        return res.status(response.status).json(response);
    }

    // --- Relational REST endpoints ---
}
