import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Query,
    Body,
    Param,
    UseGuards,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ClubSessionTemplateService } from "./club-session-template.service";
import {
    ApiCreateSessionTemplate,
    ApiUpdateSessionTemplate,
    ApiGetTemplatesBySport,
    ApiAddPhaseToTemplate,
    ApiRemovePhaseFromTemplate,
    ApiDeleteTemplate,
} from "../../swagger/club-sessions/api-decorators";
import {
    CreateSessionTemplateDto,
    UpdateSessionTemplateDto,
    AddPhaseDto,
} from "../../dto/club-session-template.dto";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { UsePipes, ValidationPipe } from "@nestjs/common";

@ApiTags("Session Templates")
@Controller("club-sessions")
@UseGuards(JwtAuthGuard, RolesGuard)
@UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
@Controller("session-templates")
export class ClubSessionTemplateController {
    constructor(private readonly templateService: ClubSessionTemplateService) {}

    @Post()
    @ApiCreateSessionTemplate()
    async createTemplate(
        @Query("sportProfileId") sportProfileId: string,
        @Body() createTemplateDto: CreateSessionTemplateDto
    ) {
        return this.templateService.createTemplate(
            sportProfileId,
            createTemplateDto
        );
    }

    @Put()
    @ApiUpdateSessionTemplate()
    async updateTemplate(
        @Query("templateId") templateId: string,
        @Body() updateTemplateDto: UpdateSessionTemplateDto
    ) {
        return this.templateService.updateTemplate(
            templateId,
            updateTemplateDto
        );
    }

    @Get()
    @ApiGetTemplatesBySport()
    async getTemplatesBySport(@Query("sportProfileId") sportProfileId: string) {
        return this.templateService.getTemplatesBySport(sportProfileId);
    }

    @Post("phase")
    @ApiAddPhaseToTemplate()
    async addPhaseToTemplate(
        @Query("templateId") templateId: string,
        @Body() phaseDto: AddPhaseDto
    ) {
        return this.templateService.addPhaseToTemplate(templateId, phaseDto);
    }

    @Delete("phase")
    @ApiRemovePhaseFromTemplate()
    async removePhaseFromTemplate(
        @Query("templateId") templateId: string,
        @Query("phaseId") phaseId: string
    ) {
        return this.templateService.removePhaseFromTemplate(
            templateId,
            phaseId
        );
    }

    @Delete()
    @ApiDeleteTemplate()
    async deleteTemplate(@Query("templateId") templateId: string) {
        return this.templateService.deleteTemplate(templateId);
    }
}
