import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import { SessionRecordsService } from "./sessionRecords.service";
import { SessionRecord } from "../../entities/sessionRecord.entity";
import { CreateSessionRecordDto } from "../../dto/sessionRecords/create-sessionRecord.dto";
import { UpdateSessionRecordDto } from "../../dto/sessionRecords/update-sessionRecord.dto";
import { SessionRecordFields } from "../../enums/tables-data.enum";
import {
    ControllerWrapper,
    EditorsWrapper,
    GetAllByQuery,
} from "src/decorators";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetAllProps } from "src/types/getOperators";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import CustomResponseType from "src/types/customResponseType";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { SessionRecordStatus } from "src/enums/athletes.enum";

const transferMapping: NewInstanceTransformer = {};

@ControllerWrapper("SessionRecords")
export class SessionRecordsController {
    constructor(
        private readonly sessionRecordsService: SessionRecordsService
    ) {}

    // --- Basic REST endpoints ---

    @Get()
    @GetAllByQuery({
        fieldsEnum: SessionRecordFields,
        descendants: [
            ...RELATIONS.sessionRecord.oneToMany,
            ...RELATIONS.sessionRecord.manyToOne,
            ...RELATIONS.sessionRecord.manyToMany,
        ],
    })
    async getSessionRecords(
        @Query(
            new GetAllPipe(SessionRecordFields, [
                ...RELATIONS.sessionRecord.manyToOne,
                ...RELATIONS.sessionRecord.manyToMany,
            ])
        )
        query: GetAllProps<SessionRecordFields>,
        @Query("status") status: SessionRecordStatus,
        @Res() res: Response
    ) {
        const response: CustomResponseType<SessionRecord[]> =
            await this.sessionRecordsService.getSessionRecords(query, status);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single sessionRecord using its ID" })
    async getSessionRecordById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<SessionRecord> =
            await this.sessionRecordsService.getSessionRecordById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateSessionRecordDto, "create a new sessionRecord")
    async createSessionRecord(
        @Body(new NewInstancePipe(transferMapping))
        createSessionRecordDto: CreateSessionRecordDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<SessionRecord> =
            await this.sessionRecordsService.createSessionRecord(
                createSessionRecordDto
            );

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateSessionRecordDto, "update a sessionRecord")
    async updateSessionRecord(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateSessionRecordDto: UpdateSessionRecordDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.sessionRecordsService.updateSessionRecord(
                id,
                updateSessionRecordDto
            );

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    @ApiOperation({ summary: "delete all sessionRecords" })
    async deleteAllSessionRecords(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.sessionRecordsService.deleteAllSessionRecords();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a sessionRecord" })
    async deleteSessionRecord(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.sessionRecordsService.deleteSessionRecord(id);

        return res.status(response.status).json(response);
    }

    // --- Relational REST endpoints ---
}
