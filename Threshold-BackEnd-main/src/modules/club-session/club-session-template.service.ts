import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ClubSessionTemplate } from "../../entities/clubSessionTemplate.entity";
import {
    CreateSessionTemplateDto,
    UpdateSessionTemplateDto,
    AddPhaseDto,
} from "../../dto/club-session-template.dto";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class ClubSessionTemplateService {
    constructor(
        @InjectRepository(ClubSessionTemplate)
        private readonly templateRepository: Repository<ClubSessionTemplate>
    ) {}

    async createTemplate(
        sportProfileId: string,
        createTemplateDto: CreateSessionTemplateDto
    ): Promise<ClubSessionTemplate> {
        console.log("sportProfileId", sportProfileId);
        const template = this.templateRepository.create({
            ...createTemplateDto,
            sportProfileId,
            phases: createTemplateDto.phases.map((phase, index) => ({
                ...phase,
                id: `ph-${Date.now()}-${index}`,
                order: index + 1,
                unit: phase.unit || "count",
                target: phase.target || 0,
            })),
        });

        return this.templateRepository.save(template);
    }

    async updateTemplate(
        templateId: string,
        updateTemplateDto: UpdateSessionTemplateDto
    ): Promise<ClubSessionTemplate> {
        const template = await this.templateRepository.findOne({
            where: { id: templateId },
        });

        if (!template) {
            throw new NotFoundException("Template not found");
        }

        // Preserve existing phase IDs while updating other properties
        const updatedPhases = updateTemplateDto.phases.map((phase, index) => {
            const existingPhase = template.phases.find(
                (p) => p.name === phase.name
            );
            return {
                ...phase,
                id: existingPhase?.id || `ph-${Date.now()}-${index}`,
                order: index + 1,
            };
        });

        Object.assign(template, {
            ...updateTemplateDto,
            phases: updatedPhases,
        });

        return this.templateRepository.save(template);
    }

    async getTemplatesBySport(
        sportProfileId: string
    ): Promise<ClubSessionTemplate[]> {
        return this.templateRepository.find({
            where: { sportProfileId },
        });
    }

    async addPhaseToTemplate(
        templateId: string,
        phaseDto: AddPhaseDto
    ): Promise<ClubSessionTemplate> {
        const template = await this.templateRepository.findOne({
            where: { id: templateId },
        });

        if (!template) {
            throw new NotFoundException("Template not found");
        }

        if (!template.phases) {
            template.phases = [];
        }

        // Reorder existing phases if necessary
        if (phaseDto.order <= template.phases.length) {
            template.phases = template.phases.map((phase) => {
                if (phase.order >= phaseDto.order) {
                    phase.order += 1;
                }
                return phase;
            });
        }

        // Validate each technique
        for (const technique of phaseDto.techniques) {
            if (!technique.name || typeof technique.name !== "string") {
                throw new BadRequestException(
                    `Invalid technique structure: missing or invalid name in phase ${phaseDto.name}`
                );
            }
            if (!technique.value || typeof technique.value !== "string") {
                throw new BadRequestException(
                    `Invalid technique structure: missing or invalid value in technique ${technique.name}`
                );
            }
            if (!technique.unit || typeof technique.unit !== "string") {
                throw new BadRequestException(
                    `Invalid technique structure: missing or invalid unit in technique ${technique.name}`
                );
            }
        }

        // Create new phase object
        const newPhase = {
            id: phaseDto.id || uuidv4(),
            name: phaseDto.name,
            description: phaseDto.description,
            order: phaseDto.order,
            unit: phaseDto.unit,
            target: phaseDto.target,
            calculationMethod: phaseDto.calculationMethod,
            techniques: phaseDto.techniques.map((tech) => ({
                name: tech.name,
                description: tech.description,
                value: tech.value,
                unit: tech.unit,
                defaultValue: tech.defaultValue
            }))
        };

        template.phases.push(newPhase);
        template.phases.sort((a, b) => a.order - b.order);

        return this.templateRepository.save(template);
    }

    async removePhaseFromTemplate(
        templateId: string,
        phaseId: string
    ): Promise<ClubSessionTemplate> {
        const template = await this.templateRepository.findOne({
            where: { id: templateId },
        });

        if (!template) {
            throw new NotFoundException("Template not found");
        }

        const phaseIndex = template.phases?.findIndex(
            (phase) => phase.id === phaseId
        );

        if (phaseIndex === -1) {
            throw new NotFoundException("Phase not found in template");
        }

        const removedPhase = template.phases[phaseIndex];
        template.phases.splice(phaseIndex, 1);

        // Reorder remaining phases
        template.phases = template.phases.map((phase) => {
            if (phase.order > removedPhase.order) {
                phase.order -= 1;
            }
            return phase;
        });

        return this.templateRepository.save(template);
    }

    async deleteTemplate(templateId: string): Promise<void> {
        const template = await this.templateRepository.findOne({
            where: { id: templateId },
            relations: ["sessions"],
        });

        if (!template) {
            throw new NotFoundException("Template not found");
        }

        if (template.sessions?.length > 0) {
            throw new BadRequestException(
                "Cannot delete template that is in use by active sessions"
            );
        }

        await this.templateRepository.remove(template);
    }
}
