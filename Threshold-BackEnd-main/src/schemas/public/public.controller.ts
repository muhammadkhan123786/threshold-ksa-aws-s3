import { Body, Controller, Param, Post, Res } from "@nestjs/common";
import { Response } from "express";
import { PublicService } from "./public.service";
import { CreateAthleteDto } from "../../dto/athletes/create-athlete.dto";
import CustomResponseType from "src/types/customResponseType";
import { Athlete } from "../../entities/athlete.entity";
import { EditorsWrapper, ControllerWrapper } from "src/decorators";

@ControllerWrapper("public")
export class PublicController {
    constructor(private readonly publicService: PublicService) {}

    @Post(":academyId/:deviceIdentifier")
    @EditorsWrapper(CreateAthleteDto, "create a new athlete")
    async createAthlete(
        @Param("academyId") academyId: string,
        @Param("deviceIdentifier") deviceIdentifier: string,
        @Body() createAthleteDto: CreateAthleteDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<Athlete> =
            await this.publicService.createAthlete(
                academyId,
                createAthleteDto,
                deviceIdentifier
            );

        return res.status(response.status).json(response);
    }
}
