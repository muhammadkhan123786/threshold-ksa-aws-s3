import {
    Controller,
    Get,
    Patch,
    Param,
    Body,
    Res,
    UseGuards,
} from "@nestjs/common";
import { Response } from "express";
import { ApiOperation } from "@nestjs/swagger";
import { AthleteSubscriptionService } from "./athleteSubscription.service";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { AthleteSubscription } from "src/entities/athleteSubscription.entity";
import CustomResponseType from "src/types/customResponseType";
import { UpdateAthleteSubscriptionDto } from "src/dto/athleteSubscription/update-athleteSubscription.dto";

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller("athleteSubscription")
export class AthleteSubscriptionController {
    constructor(
        private readonly athleteSubscriptionService: AthleteSubscriptionService
    ) {}

    @Get(":id")
    @ApiOperation({ summary: "Get an athlete subscription by athlete ID" })
    async getAthleteSubscription(
        @Param("id") id: string,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteSubscription> =
            await this.athleteSubscriptionService.getAthleteSubscription(id);
        return res.status(response.status).json(response);
    }

    @Patch(":id")
    @ApiOperation({ summary: "Update an athlete subscription by athlete ID" })
    async updateAthleteSubscription(
        @Param("id") id: string,
        @Body() updateAthleteSubscriptionDto: UpdateAthleteSubscriptionDto,
        @Res() res: Response
    ) {
        const response: CustomResponseType<AthleteSubscription> =
            await this.athleteSubscriptionService.updateAthleteSubscription(
                id,
                updateAthleteSubscriptionDto
            );
        return res.status(response.status).json(response);
    }
}
