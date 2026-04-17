import { applyDecorators } from "@nestjs/common";
import {
    ApiOperation,
    ApiResponse,
    ApiQuery,
    ApiBody,
    ApiTags,
} from "@nestjs/swagger";
import { SessionTemplateResponseExample } from "./club-session-template.swagger";

export const ApiCreateSessionTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Create a new session template",
            description: `Creates a new training session template for a specific sport profile.
            Templates define the structure and components of training sessions including:
            - Multiple training phases
            - Specific techniques and drills
            - Measurement fields and targets
            - Default durations and intensities`,
        }),
        ApiQuery({
            name: "sportProfileId",
            description: "Sport profile identifier",
            example: "scp-123456",
            required: true,
        }),
        ApiBody({
            description: "Session template creation data",
            examples: {
                swimmingTemplate: {
                    summary: "Swimming Training Template",
                    description: "Template for comprehensive swimming training",
                    value: {
                        name: "Advanced Swimming Training",
                        description:
                            "Complete swimming workout including warm-up, main sets, and cool down",
                        phases: [
                            {
                                name: "Warm Up",
                                description:
                                    "Dynamic stretching and light swimming",
                                order: 1,
                                techniques: [
                                    {
                                        name: "Freestyle Drill",
                                        description:
                                            "Focus on form and breathing",
                                        fields: [
                                            {
                                                name: "Distance",
                                                unit: "meters",
                                                target: 400,
                                            },
                                            {
                                                name: "Time",
                                                unit: "seconds",
                                                target: 480,
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                name: "Main Set",
                                description: "Speed and endurance training",
                                order: 2,
                                techniques: [
                                    {
                                        name: "Sprint Intervals",
                                        description:
                                            "High-intensity swimming intervals",
                                        fields: [
                                            {
                                                name: "Sets",
                                                unit: "count",
                                                target: 10,
                                            },
                                            {
                                                name: "Distance per Set",
                                                unit: "meters",
                                                target: 50,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Template created successfully",
            type: SessionTemplateResponseExample,
        })
    );

export const ApiUpdateSessionTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update an existing session template",
            description: `Modifies an existing session template's structure or components.
            Allows updating:
            - Template name and description
            - Phase structure and details
            - Technique specifications
            - Measurement fields and targets`,
        }),
        ApiQuery({
            name: "templateId",
            description: "Template identifier",
            example: "tpl-123456",
            required: true,
        }),
        ApiBody({
            description: "Template update data",
            examples: {
                updatePhases: {
                    summary: "Update Training Phases",
                    description: "Modifying phases and techniques",
                    value: {
                        name: "Updated Swimming Training",
                        description: "Revised swimming workout structure",
                        phases: [
                            {
                                name: "Enhanced Warm Up",
                                description:
                                    "Extended warm-up with additional drills",
                                order: 1,
                                techniques: [
                                    {
                                        name: "Mixed Style Drill",
                                        description:
                                            "Alternating swimming styles",
                                        fields: [
                                            {
                                                name: "Distance",
                                                unit: "meters",
                                                target: 600,
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Template updated successfully",
            type: SessionTemplateResponseExample,
        })
    );

export const ApiGetTemplatesBySport = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get all templates for a sport profile",
            description: `Retrieves all training templates associated with a specific sport profile.
            Returns comprehensive template details including:
            - All phases and techniques
            - Measurement specifications
            - Usage statistics and metadata`,
        }),
        ApiQuery({
            name: "sportProfileId",
            description: "Sport profile identifier",
            example: "scp-123456",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Templates retrieved successfully",
            type: [SessionTemplateResponseExample],
        })
    );

export const ApiAddPhaseToTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Add a new phase to template",
            description: `Adds a new training phase to an existing template.
            Phase includes:
            - Name and description
            - Ordered position in template
            - Associated techniques and measurements`,
        }),
        ApiQuery({
            name: "templateId",
            description: "Template identifier",
            example: "tpl-123456",
            required: true,
        }),
        ApiBody({
            description: "New phase data",
            examples: {
                newPhase: {
                    summary: "Add Technical Phase",
                    description: "Adding a technical training phase",
                    value: {
                        name: "Technical Skills",
                        description: "Focus on swimming technique refinement",
                        order: 2,
                        techniques: [
                            {
                                name: "Stroke Analysis",
                                description: "Detailed stroke technique work",
                                fields: [
                                    {
                                        name: "Repetitions",
                                        unit: "count",
                                        target: 20,
                                    },
                                ],
                            },
                        ],
                    },
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Phase added successfully",
            type: SessionTemplateResponseExample,
        })
    );

export const ApiRemovePhaseFromTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Remove a phase from template",
            description:
                "Removes an existing phase from the template and reorders remaining phases",
        }),
        ApiQuery({
            name: "templateId",
            description: "Template identifier",
            example: "tpl-123456",
            required: true,
        }),
        ApiQuery({
            name: "phaseId",
            description: "Phase identifier to remove",
            example: "ph-123456",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Phase removed successfully",
            type: SessionTemplateResponseExample,
        })
    );

export const ApiDeleteTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Delete a session template",
            description: `Permanently removes a session template.
            Note: Cannot delete templates that are currently in use by active sessions.`,
        }),
        ApiQuery({
            name: "templateId",
            description: "Template identifier",
            example: "tpl-123456",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Template deleted successfully",
        }),
        ApiResponse({
            status: 400,
            description: "Cannot delete template in use",
        })
    );
