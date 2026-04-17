import {
    Body,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { DeleteResult, UpdateResult } from "typeorm";
import { Response } from "express";
import {
    EditorsWrapper,
    ControllerWrapper,
    GetAllByQuery,
} from "src/decorators";
import { GetAllProps } from "src/types/getOperators";
import CustomResponseType from "src/types/customResponseType";
import { AcademiesService } from "./academies.service";
import { Academy } from "../../entities/academy.entity";
import { CreateAcademyDto } from "../../dto/academies/create-academy.dto";
import { UpdateAcademyDto } from "../../dto/academies/update-academy.dto";
import { AcademyFields } from "../../enums/tables-data.enum";
import { NewInstanceTransformer } from "src/types/app.type";
import { NewInstancePipe } from "src/pipes/newInstance.pipe";
import { RELATIONS } from "src/lib/constants/table-relations";
import { GetAllPipe } from "src/pipes/getAll.pipe";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";

const transferMapping: NewInstanceTransformer = {};

@UseGuards(JwtAuthGuard, RolesGuard)
@ControllerWrapper("academies")
export class AcademiesController {
    constructor(private readonly academiesService: AcademiesService) {}

    @Get()
    @GetAllByQuery({
        fieldsEnum: AcademyFields,
        descendants: [
            ...RELATIONS.academy.oneToMany,
            ...RELATIONS.academy.manyToOne,
            ...RELATIONS.academy.manyToMany,
        ],
    })
    async getAcademies(
        @Query(
            new GetAllPipe(AcademyFields, [
                ...RELATIONS.academy.manyToOne,
                ...RELATIONS.academy.manyToMany,
            ])
        )
        query: GetAllProps<AcademyFields>,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Academy[]> =
            await this.academiesService.getAcademies(query);
        return res.status(response.status).json(response);
    }

    @Get(":id")
    @ApiOperation({ summary: "get a single academy using its ID" })
    async getAcademyById(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<Academy> =
            await this.academiesService.getAcademyById(id);

        return res.status(response.status).json(response);
    }

    @Post()
    @EditorsWrapper(CreateAcademyDto, "create a new academy")
    async createAcademy(
        @Body(new NewInstancePipe(transferMapping))
        createAcademyDto: CreateAcademyDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Academy> =
            await this.academiesService.createAcademy(createAcademyDto);

        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @EditorsWrapper(UpdateAcademyDto, "update a academy")
    async updateAcademy(
        @Param("id") id: string,
        @Body(new NewInstancePipe(transferMapping))
        updateAcademyDto: UpdateAcademyDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<UpdateResult> =
            await this.academiesService.updateAcademy(id, updateAcademyDto);

        return res.status(response.status).json(response);
    }

    @Delete("wipe")
    // @AdminsOnly()
    @ApiOperation({ summary: "delete all academies" })
    async deleteAllAcademies(@Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.academiesService.deleteAllAcademies();

        return res.status(response.status).json(response);
    }

    @Delete(":id")
    @ApiOperation({ summary: "delete a academy" })
    async deleteAcademy(@Param("id") id: string, @Res() res: Response) {
        const response: CustomResponseType<DeleteResult> =
            await this.academiesService.deleteAcademy(id);

        return res.status(response.status).json(response);
    }
}
