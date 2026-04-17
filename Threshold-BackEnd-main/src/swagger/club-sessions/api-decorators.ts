import { applyDecorators } from "@nestjs/common";
import {
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBody,
    ApiTags,
} from "@nestjs/swagger";
import { ClubSessionResponseDto } from "./club-session.swagger";
import { SessionTemplateResponseExample } from "./club-session-template.swagger";
import { UpdateSessionResultsRequestDto } from "./club-session-request.swagger";
import { ClubSession } from "../../entities/clubSession.entity";
import { ClubSessionTemplate } from "../../entities/clubSessionTemplate.entity";
import { CreateClubSessionDto } from "../../dto/club-session.dto";
import { UpdateClubSessionDto } from "../../dto/club-session.dto";
import { UpdateSessionResultsDto } from "../../dto/club-session-results.dto";
import { GetSessionPhasesResponseDto } from "../../dto/club-session/get-session-phases.dto";
import { SessionPhaseRecordsResponseDto } from "../../dto/club-session/session-phase-records.dto";
import { UpdateSessionPhaseRecordsDto } from "../../dto/club-session/update-session-phase-records.dto";
import { CreateSessionTemplateExample } from "./club-session-template.swagger";
import { PhaseExample } from "./club-session-template.swagger";
import { GetTemplatePhasesResponseDto } from "../../dto/club-session-template/get-template-phases.dto";
import { SubmitPlayerRevisionDto } from "../../dto/club-session/submit-player-revision.dto";
import { SessionRevisionResponseDto } from "../../dto/club-session/session-revision-response.dto";

export const ApiCreateSession = () =>
    applyDecorators(
        ApiOperation({
            summary: "Create a new club session",
            description: `Creates a new training session for a team based on a template. 
            This endpoint allows coaches to schedule training sessions by specifying:
            - Basic session details (title, date, time)
            - Mission and volume targets
            - Training spaces
            - Average perceived exertion
            - Template reference
            - Additional notes and instructions`,
        }),
        ApiParam({
            name: "teamId",
            description: "Team identifier",
            example: "550e8400-e29b-41d4-a716-446655440001",
            required: true,
        }),
        ApiBody({
            description: "Club session creation data",
            examples: {
                swimmingTraining: {
                    summary: "Swimming Training Session",
                    description: "Complete swimming training session setup",
                    value: {
                        missionAssociated: "Mission 1: Speed Development",
                        volumeTargeted: "10000",
                        templateId: "550e8400-e29b-41d4-a716-446655440002",
                        title: "Advanced Swimming Training - Week 1",
                        spaces: ["Olympic Pool - Lane 1-4", "Gym Area"],
                        averagePE: 7.5,
                        day: "2024-03-15",
                        startTime: "11:00 am",
                        endTime: "12:30 pm",
                        notes: "Focus on technique and endurance. Bring goggles and swim cap.",
                    },
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Session created successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description: "Invalid request body or parameters",
        }),
        ApiResponse({
            status: 404,
            description: "Team or template not found",
        })
    );

export const ApiUpdateSession = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update an existing club session",
            description: `Modifies an existing training session's details. 
            Allows updating:
            - Session timing and duration
            - Training spaces
            - Invited positions
            - Notes and instructions
            - Session status
            - Phase results and measurements
            
            Note: Cannot update a session that has already been completed or cancelled.`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiBody({
            description: "Session update data",
            examples: {
                weatherChange: {
                    summary: "Update Due to Weather",
                    description:
                        "Moving session indoors due to weather forecast",
                    value: {
                        startTime: "11:00 am",
                        endTime: "12:30 pm",
                        spaces: ["Indoor Training Complex - Court 2"],
                        notes: "Session moved indoors due to heavy rain forecast. Bring indoor shoes only.",
                    },
                },
                tacticsFocus: {
                    summary: "Change Training Focus",
                    description:
                        "Updating session to focus on specific tactical elements",
                    value: {
                        invitedPositions: ["Defender", "Defensive Midfielder"],
                        notes: "Session will focus on defensive organization and transition play. Video analysis session will follow.",
                        phaseResults: [
                            {
                                phaseId: "550e8400-e29b-41d4-a716-446655440004",
                                techniques: [
                                    {
                                        techniqueId:
                                            "550e8400-e29b-41d4-a716-446655440005",
                                        results: [
                                            {
                                                playerId:
                                                    "550e8400-e29b-41d4-a716-446655440006",
                                                value: 85,
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
            description: "Session updated successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description: "Invalid update data",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiGetSessionsByTeam = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get all sessions for a team",
            description: `Retrieves all training sessions associated with a specific team.
            Results can be filtered by:
            - Session status
            - Date range
            - Template type
            
            Sessions are returned in chronological order.`,
        }),
        ApiParam({
            name: "teamId",
            description: "Team identifier",
            example: "550e8400-e29b-41d4-a716-446655440001",
            required: true,
        }),
        ApiQuery({
            name: "status",
            description: "Filter by session status",
            required: false,
            enum: ["NOT_STARTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
        }),
        ApiResponse({
            status: 200,
            description: "List of sessions retrieved successfully",
            type: [ClubSession],
        }),
        ApiResponse({
            status: 404,
            description: "Team not found",
        })
    );

export const ApiGetUpcomingSessions = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get upcoming sessions for a team",
            description: `Retrieves all future scheduled sessions for a team.
            Includes:
            - Sessions in 'NOT_STARTED' status
            - Sessions scheduled from current time onwards
            - Full session details including template information
            
            Results can be limited by specifying the number of days to look ahead.`,
        }),
        ApiParam({
            name: "teamId",
            description: "Team identifier",
            example: "550e8400-e29b-41d4-a716-446655440001",
            required: true,
        }),
        ApiQuery({
            name: "days",
            description: "Number of days to look ahead",
            example: 7,
            required: false,
            type: Number,
        }),
        ApiResponse({
            status: 200,
            description: "List of upcoming sessions retrieved",
            type: [ClubSession],
        }),
        ApiResponse({
            status: 404,
            description: "Team not found",
        })
    );

export const ApiGetCompletedSessions = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get completed sessions for a team",
            description: `Retrieves all completed training sessions for a team.
            Includes:
            - Full session details
            - Phase results and measurements
            - Player performance data
            - Session statistics`,
        }),
        ApiParam({
            name: "teamId",
            description: "Team identifier",
            example: "550e8400-e29b-41d4-a716-446655440001",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "List of completed sessions retrieved",
            type: [ClubSession],
        }),
        ApiResponse({
            status: 404,
            description: "Team not found",
        })
    );

export const ApiGetSessionById = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get a specific session by ID",
            description: `Retrieves detailed information about a specific training session.
            Includes:
            - Basic session details
            - Template information
            - Phase structure and techniques
            - Results and measurements (if completed)
            - Participant information`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session retrieved successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiDeleteSession = () =>
    applyDecorators(
        ApiOperation({
            summary: "Delete a session",
            description: `Permanently removes a training session and all associated data.
            This action cannot be undone.
            Only sessions in 'NOT_STARTED' status can be deleted.`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session deleted successfully",
        }),
        ApiResponse({
            status: 400,
            description: "Session cannot be deleted",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiGetSessionsByDateRange = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get sessions within a date range",
            description: `Retrieves all sessions scheduled within a specified date range.
            Useful for:
            - Weekly/monthly session planning
            - Calendar view population
            - Training load analysis
            - Performance tracking`,
        }),
        ApiParam({
            name: "teamId",
            description: "Team identifier",
            example: "550e8400-e29b-41d4-a716-446655440001",
            required: true,
        }),
        ApiQuery({
            name: "startDate",
            description: "Start date (YYYY-MM-DD format)",
            example: "2024-03-01",
            required: true,
        }),
        ApiQuery({
            name: "endDate",
            description: "End date (YYYY-MM-DD format)",
            example: "2024-03-31",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "List of sessions retrieved",
            type: [ClubSession],
        }),
        ApiResponse({
            status: 400,
            description: "Invalid date range",
        }),
        ApiResponse({
            status: 404,
            description: "Team not found",
        })
    );

export const ApiStartSession = () =>
    applyDecorators(
        ApiOperation({
            summary: "Start a session",
            description: `Marks a training session as started.
            Updates the session status to 'IN_PROGRESS'.
            Only sessions in 'NOT_STARTED' status can be started.`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session started successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description: "Session cannot be started",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiCompleteSession = () =>
    applyDecorators(
        ApiOperation({
            summary: "Complete a session",
            description: `Marks a training session as completed.
            Updates the session status to 'COMPLETED'.
            Only sessions in 'IN_PROGRESS' status can be completed.
            Results and measurements should be recorded before completing the session.`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session completed successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description: "Session cannot be completed",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiCancelSession = () =>
    applyDecorators(
        ApiOperation({
            summary: "Cancel a session",
            description: `Marks a training session as cancelled.
            Updates the session status to 'CANCELLED'.
            Only sessions in 'NOT_STARTED' or 'IN_PROGRESS' status can be cancelled.`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session cancelled successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description: "Session cannot be cancelled",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiGetTemplatesBySport = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get session templates by sport ID",
            description: `Retrieves all training session templates for a specific sport.
            Returns templates with their phases and techniques in order.`,
        }),
        ApiParam({
            name: "sportId",
            description: "Sport identifier",
            example: "sport-123",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Templates retrieved successfully",
            schema: {
                example: {
                    templates: [
                        {
                            id: "template-123",
                            name: "Strength Training Template",
                            sportId: "sport-123",
                            phases: [
                                {
                                    id: "phase-1",
                                    name: "Curl-up",
                                    order: 1,
                                    techniques: [
                                        {
                                            name: "Basic Curl",
                                            value: "100",
                                            unit: "meters",
                                        },
                                    ],
                                },
                                {
                                    id: "phase-2",
                                    name: "Push up",
                                    order: 2,
                                    techniques: [
                                        {
                                            name: "Standard Push-up",
                                            value: "100",
                                            unit: "meters",
                                        },
                                    ],
                                },
                                {
                                    id: "phase-3",
                                    name: "Trunck-lift",
                                    order: 3,
                                    techniques: [
                                        {
                                            name: "Basic Lift",
                                            value: "100",
                                            unit: "meters",
                                        },
                                    ],
                                },
                            ],
                            createdAt: "2024-03-09T00:00:00Z",
                            updatedAt: "2024-03-09T00:00:00Z",
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Sport not found",
        })
    );

export const ApiGetSessionTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get the template used for a session",
            description: `Retrieves the template associated with a specific session.
            
Features:
- Complete template structure
- Phase details with techniques
- Calculation methods
- Target values and units

Use Cases:
- Session preparation
- Performance tracking setup
- Training customization`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Template retrieved successfully",
            schema: {
                example: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    sportProfileId: "swimming-001",
                    name: "Advanced Swimming Training",
                    description:
                        "Complete swimming workout including warm-up, main sets, and cool down",
                    phases: [
                        {
                            id: "ph-001",
                            name: "Warm Up",
                            description:
                                "Dynamic stretching and light swimming",
                            order: 1,
                            unit: "meters",
                            target: 400,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "400",
                                    unit: "meters",
                                },
                                {
                                    name: "Speed",
                                    value: "60",
                                    unit: "percentage",
                                },
                            ],
                        },
                        {
                            id: "ph-002",
                            name: "Main Set",
                            description: "High-intensity interval training",
                            order: 2,
                            unit: "meters",
                            target: 1500,
                            calculationMethod: "SUM",
                            techniques: [
                                {
                                    name: "Sprint Distance",
                                    value: "100",
                                    unit: "meters",
                                },
                                {
                                    name: "Recovery Distance",
                                    value: "50",
                                    unit: "meters",
                                },
                            ],
                        },
                    ],
                    createdAt: "2024-03-08T12:00:00Z",
                    updatedAt: "2024-03-08T12:00:00Z",
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Session or template not found",
        })
    );

export const ApiGetSessionResults = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get the results of a session",
            description: `Retrieves all recorded results and measurements for a session.
            Includes:
            - Phase-by-phase results
            - Individual player measurements
            - Team statistics
            - Performance indicators`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session results retrieved successfully",
            type: UpdateSessionResultsRequestDto,
        }),
        ApiResponse({
            status: 404,
            description: "Session not found or no results available",
        })
    );

export const ApiUpdateSessionResults = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update session results",
            description: `Records or updates the results and measurements from a training session.
            Supports:
            - Individual player measurements
            - Phase-by-phase results
            - Multiple measurement types per technique
            - Bulk result updates
            
            Results can only be updated for completed sessions.`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiBody({
            description: "Session results data",
            examples: {
                footballTrainingResults: {
                    summary: "Football Training Results",
                    description:
                        "Complete results for a technical football training session",
                    value: {
                        phaseResults: [
                            {
                                phaseId: "550e8400-e29b-41d4-a716-446655440004",
                                phaseName: "Dynamic Warm-up",
                                target: 15,
                                techniques: [
                                    {
                                        techniqueId:
                                            "550e8400-e29b-41d4-a716-446655440005",
                                        techniqueName: "Dynamic Stretching",
                                        fields: [
                                            {
                                                fieldId: "duration",
                                                fieldName: "Duration",
                                                unit: "minutes",
                                                results: [
                                                    {
                                                        playerId:
                                                            "550e8400-e29b-41d4-a716-446655440006",
                                                        playerName:
                                                            "Mohamed Salah",
                                                        value: 12,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                            {
                                phaseId: "550e8400-e29b-41d4-a716-446655440007",
                                phaseName: "Technical Drills",
                                target: 30,
                                techniques: [
                                    {
                                        techniqueId:
                                            "550e8400-e29b-41d4-a716-446655440008",
                                        techniqueName: "Short Passing Accuracy",
                                        fields: [
                                            {
                                                fieldId: "accuracy",
                                                fieldName: "Passing Accuracy",
                                                unit: "percentage",
                                                results: [
                                                    {
                                                        playerId:
                                                            "550e8400-e29b-41d4-a716-446655440006",
                                                        playerName:
                                                            "Mohamed Salah",
                                                        value: 85,
                                                    },
                                                ],
                                            },
                                            {
                                                fieldId: "completed",
                                                fieldName: "Passes Completed",
                                                unit: "count",
                                                results: [
                                                    {
                                                        playerId:
                                                            "550e8400-e29b-41d4-a716-446655440006",
                                                        playerName:
                                                            "Mohamed Salah",
                                                        value: 45,
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ],
                            },
                        ],
                    },
                },
                basketballResults: {
                    summary: "Basketball Training Results",
                    description: "Results for shooting and conditioning drills",
                    value: {
                        phaseResults: [
                            {
                                phaseId: "550e8400-e29b-41d4-a716-446655440009",
                                phaseName: "Shooting Practice",
                                target: 20,
                                techniques: [
                                    {
                                        techniqueId:
                                            "550e8400-e29b-41d4-a716-446655440010",
                                        techniqueName: "Free Throw Practice",
                                        fields: [
                                            {
                                                fieldId: "accuracy",
                                                fieldName:
                                                    "Free Throw Accuracy",
                                                unit: "percentage",
                                                results: [
                                                    {
                                                        playerId:
                                                            "550e8400-e29b-41d4-a716-446655440011",
                                                        playerName:
                                                            "Stephen Curry",
                                                        value: 90,
                                                    },
                                                ],
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
            description: "Session results updated successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description: "Invalid results data",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiGetSessionPhasesWithPlayers = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get session phases with players",
            description: `Retrieves detailed session phase information with player data.
            
Features:
- Complete phase structure with techniques and fields
- All team athletes with their profiles
- Measurement targets and units
- Performance tracking data

Use Cases:
- Session data entry forms
- Result review and analysis
- Player progress tracking
- Performance comparisons`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Complete session phase data with player information",
            schema: {
                example: {
                    phases: [
                        {
                            phaseId: "ph-1234",
                            phaseName: "Warm-up",
                            target: 15,
                            techniques: [
                                {
                                    techniqueName: "Freestyle",
                                    fields: [
                                        {
                                            fieldName: "50m",
                                            unit: "meters",
                                            results: [
                                                {
                                                    playerId:
                                                        "550e8400-e29b-41d4-a716-446655440001",
                                                    playerName: "John Doe",
                                                    value: 100,
                                                },
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                    players: [
                        {
                            id: "550e8400-e29b-41d4-a716-446655440001",
                            name: "John Doe",
                            position: "Forward",
                            level: "Advanced",
                            weight: 75.5,
                            clublevel: "Professional",
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Session or template not found",
        })
    );

export const ApiGetSessionPhaseRecords = () =>
    applyDecorators(
        ApiOperation({
            summary: "Get session phase records",
            description: `Retrieves phases and assigned athletes for a specific session.
            
Features:
- Complete phase details with order and description
- Techniques with value, unit, and results
- Athlete records with positions
- Measurement tracking per athlete`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "406ae1c8-4cb9-4b4c-9f25-07edfb0e42c6",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description:
                "Session phases with assigned athletes retrieved successfully",
            schema: {
                example: {
                    sessionId: "406ae1c8-4cb9-4b4c-9f25-07edfb0e42c6",
                    sessionTitle: "Technical Skills Development",
                    sportId: "swimming-001",
                    phaseRecords: [
                        {
                            phaseId: "phase-001",
                            phaseName: "Warm-up",
                            order: 1,
                            description:
                                "Initial warm-up phase with basic drills",
                            techniques: [
                                {
                                    name: "Freestyle Drill",
                                    value: "400",
                                    unit: "meters",
                                    results: [
                                        {
                                            playerId: "athlete-001",
                                            value: 400,
                                        },
                                        {
                                            playerId: "athlete-002",
                                            value: 350,
                                        },
                                    ],
                                },
                            ],
                            athleteRecords: [
                                {
                                    athleteId: "athlete-001",
                                    athleteName: "John Doe",
                                    position: "Freestyle Specialist",
                                    measurements: {
                                        "Freestyle Drill": 400,
                                    },
                                },
                                {
                                    athleteId: "athlete-002",
                                    athleteName: "Jane Smith",
                                    position: "All-Around",
                                    measurements: {
                                        "Freestyle Drill": 350,
                                    },
                                },
                            ],
                        },
                        {
                            phaseId: "phase-002",
                            phaseName: "Main Set",
                            order: 2,
                            description: "High-intensity training set",
                            techniques: [
                                {
                                    name: "Sprint",
                                    value: "85",
                                    unit: "percentage",
                                    results: [
                                        {
                                            playerId: "athlete-001",
                                            value: 85,
                                        },
                                        {
                                            playerId: "athlete-002",
                                            value: 82,
                                        },
                                    ],
                                },
                                {
                                    name: "Distance",
                                    value: "1500",
                                    unit: "meters",
                                    results: [
                                        {
                                            playerId: "athlete-001",
                                            value: 1500,
                                        },
                                        {
                                            playerId: "athlete-002",
                                            value: 1400,
                                        },
                                    ],
                                },
                            ],
                            athleteRecords: [
                                {
                                    athleteId: "athlete-001",
                                    athleteName: "John Doe",
                                    position: "Freestyle Specialist",
                                    measurements: {
                                        Sprint: 85,
                                        Distance: 1500,
                                    },
                                },
                                {
                                    athleteId: "athlete-002",
                                    athleteName: "Jane Smith",
                                    position: "All-Around",
                                    measurements: {
                                        Sprint: 82,
                                        Distance: 1400,
                                    },
                                },
                            ],
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );

export const ApiUpdateSessionPhaseRecords = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update session phase records",
            description: `Updates measurements for athletes in each phase.
            
Features:
- Simple value recording per technique
- Direct technique-player value mapping
- Bulk update support for multiple phases

Notes:
- Uses technique IDs for reliable referencing
- Each record contains a single value for a technique-player combination
- Supports batch updates across multiple phases`,
        }),
        ApiParam({
            name: "id",
            description: "Session identifier",
            example: "406ae1c8-4cb9-4b4c-9f25-07edfb0e42c6",
            required: true,
        }),
        ApiBody({
            description: "Phase records update data",
            schema: {
                example: {
                    phaseRecords: [
                        {
                            phaseId: "ph-1741477600577-0",
                            records: [
                                {
                                    techniqueId: "tech-123",
                                    playerId:
                                        "b5db8d99-5a9b-4176-a333-33008a316335",
                                    value: 400,
                                },
                                {
                                    techniqueId: "tech-124",
                                    playerId:
                                        "b5db8d99-5a9b-4176-a333-33008a316335",
                                    value: 85,
                                },
                            ],
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Phase records updated successfully",
            schema: {
                example: {
                    sessionId: "406ae1c8-4cb9-4b4c-9f25-07edfb0e42c6",
                    phaseRecords: [
                        {
                            phaseId: "ph-1741477600577-0",
                            phaseName: "Warm Up",
                            techniques: [
                                {
                                    id: "tech-123",
                                    name: "Distance",
                                    value: "400",
                                    unit: "meters",
                                    results: [
                                        {
                                            playerId:
                                                "b5db8d99-5a9b-4176-a333-33008a316335",
                                            value: 400,
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Invalid measurement data",
        }),
        ApiResponse({
            status: 404,
            description: "Session, phase, or technique not found",
        })
    );

export const ApiCreateSessionTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Create a new session template",
            description: `Creates a new training session template for a specific sport profile.
            
Features:
- Multiple training phases with order and targets
- Simple technique measurements with units
- Calculation methods for phase results
- Customizable descriptions and units

Notes:
- Each phase can have multiple techniques
- Each technique requires fields array with measurements
- Phases support different calculation methods (AVERAGE, SUM, MAX, MIN)
- Templates are reusable across sessions`,
        }),
        ApiBody({
            description: "Session template creation data",
            schema: {
                example: {
                    sportProfileId: "swimming-001",
                    name: "Advanced Swimming Training",
                    description:
                        "Complete swimming workout including warm-up, main sets, and cool down",
                    phases: [
                        {
                            name: "Warm Up",
                            description:
                                "Dynamic stretching and light swimming",
                            order: 1,
                            unit: "meters",
                            target: 400,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "400",
                                    unit: "meters",
                                },
                                {
                                    name: "Speed",
                                    value: "60",
                                    unit: "percentage",
                                },
                            ],
                        },
                        {
                            name: "Main Set",
                            description: "High-intensity interval training",
                            order: 2,
                            unit: "meters",
                            target: 1500,
                            calculationMethod: "SUM",
                            techniques: [
                                {
                                    name: "Sprint Distance",
                                    value: "100",
                                    unit: "meters",
                                },
                                {
                                    name: "Recovery Distance",
                                    value: "50",
                                    unit: "meters",
                                },
                            ],
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 201,
            description: "Template created successfully",
            schema: {
                example: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    sportProfileId: "swimming-001",
                    name: "Advanced Swimming Training",
                    description:
                        "Complete swimming workout including warm-up, main sets, and cool down",
                    phases: [
                        {
                            id: "ph-001",
                            name: "Warm Up",
                            description:
                                "Dynamic stretching and light swimming",
                            order: 1,
                            unit: "meters",
                            target: 400,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "400",
                                    unit: "meters",
                                },
                                {
                                    name: "Speed",
                                    value: "60",
                                    unit: "percentage",
                                },
                            ],
                        },
                    ],
                    createdAt: "2024-03-08T12:00:00Z",
                    updatedAt: "2024-03-08T12:00:00Z",
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Invalid request data",
        }),
        ApiResponse({
            status: 404,
            description: "Sport profile not found",
        })
    );

export const ApiUpdateSessionTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update an existing session template",
            description: `Updates the structure and components of an existing training session template.
            
Features:
- Modify phases and techniques
- Update calculation methods
- Adjust targets and units
- Reorder phases

Notes:
- All phases must be included in the update
- Existing measurements are preserved
- Template ID cannot be changed`,
        }),
        ApiParam({
            name: "id",
            description: "Template identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiBody({
            description: "Template update data",
            schema: {
                example: {
                    name: "Advanced Swimming Training - Updated",
                    description:
                        "Updated swimming workout with modified intensities",
                    phases: [
                        {
                            name: "Extended Warm Up",
                            description: "Longer warm-up with technique focus",
                            order: 1,
                            unit: "meters",
                            target: 600,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "600",
                                    unit: "meters",
                                },
                                {
                                    name: "Speed",
                                    value: "50",
                                    unit: "percentage",
                                },
                            ],
                        },
                        {
                            name: "Sprint Set",
                            description: "High-intensity sprint training",
                            order: 2,
                            unit: "meters",
                            target: 800,
                            calculationMethod: "SUM",
                            techniques: [
                                {
                                    name: "Sprint",
                                    value: "50",
                                    unit: "meters",
                                },
                                {
                                    name: "Recovery",
                                    value: "25",
                                    unit: "meters",
                                },
                            ],
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Template updated successfully",
            schema: {
                example: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    sportProfileId: "swimming-001",
                    name: "Advanced Swimming Training - Updated",
                    description:
                        "Updated swimming workout with modified intensities",
                    phases: [
                        {
                            id: "ph-001",
                            name: "Extended Warm Up",
                            description: "Longer warm-up with technique focus",
                            order: 1,
                            unit: "meters",
                            target: 600,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "600",
                                    unit: "meters",
                                },
                                {
                                    name: "Speed",
                                    value: "50",
                                    unit: "percentage",
                                },
                            ],
                        },
                    ],
                    createdAt: "2024-03-08T12:00:00Z",
                    updatedAt: "2024-03-08T12:00:00Z",
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Invalid update data",
        }),
        ApiResponse({
            status: 404,
            description: "Template not found",
        })
    );

export const ApiAddPhaseToTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Add a phase to a template",
            description: `Adds a new training phase to an existing session template.
            
Features:
- Add new phase with techniques
- Automatic phase ordering
- Configurable calculation method
- Multiple technique support

Notes:
- Phase order will be set automatically
- Techniques must include value and unit
- Calculation method is required`,
        }),
        ApiParam({
            name: "id",
            description: "Template identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiBody({
            description: "Phase data",
            schema: {
                example: {
                    name: "Cool Down",
                    description: "Light swimming and stretching",
                    unit: "meters",
                    target: 200,
                    calculationMethod: "AVERAGE",
                    techniques: [
                        {
                            name: "Distance",
                            value: "200",
                            unit: "meters",
                        },
                        {
                            name: "Speed",
                            value: "40",
                            unit: "percentage",
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Phase added successfully",
            schema: {
                example: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    sportProfileId: "swimming-001",
                    name: "Advanced Swimming Training",
                    description:
                        "Complete swimming workout including warm-up, main sets, and cool down",
                    phases: [
                        {
                            id: "ph-001",
                            name: "Warm Up",
                            description:
                                "Dynamic stretching and light swimming",
                            order: 1,
                            unit: "meters",
                            target: 400,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "400",
                                    unit: "meters",
                                },
                            ],
                        },
                        {
                            id: "ph-002",
                            name: "Cool Down",
                            description: "Light swimming and stretching",
                            order: 2,
                            unit: "meters",
                            target: 200,
                            calculationMethod: "AVERAGE",
                            techniques: [
                                {
                                    name: "Distance",
                                    value: "200",
                                    unit: "meters",
                                },
                                {
                                    name: "Speed",
                                    value: "40",
                                    unit: "percentage",
                                },
                            ],
                        },
                    ],
                    createdAt: "2024-03-08T12:00:00Z",
                    updatedAt: "2024-03-08T12:00:00Z",
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Invalid phase data",
        }),
        ApiResponse({
            status: 404,
            description: "Template not found",
        })
    );

export const ApiRemovePhaseFromTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Remove a phase from a template",
            description: `Removes a training phase from an existing session template.
            
Features:
- Automatic phase reordering
- Preserves template integrity
- Updates calculation dependencies

Notes:
- Cannot remove all phases from a template
- Phase order will be adjusted automatically
- Associated measurements will be archived`,
        }),
        ApiParam({
            name: "id",
            description: "Template identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiParam({
            name: "phaseId",
            description: "Phase identifier",
            example: "ph-001",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Phase removed successfully",
            schema: {
                example: {
                    id: "550e8400-e29b-41d4-a716-446655440000",
                    sportProfileId: "swimming-001",
                    name: "Advanced Swimming Training",
                    description:
                        "Complete swimming workout including warm-up, main sets, and cool down",
                    phases: [
                        {
                            id: "ph-002",
                            name: "Main Set",
                            description: "High-intensity interval training",
                            order: 1,
                            unit: "meters",
                            target: 1500,
                            calculationMethod: "SUM",
                            techniques: [
                                {
                                    name: "Sprint Distance",
                                    value: "100",
                                    unit: "meters",
                                },
                                {
                                    name: "Recovery Distance",
                                    value: "50",
                                    unit: "meters",
                                },
                            ],
                        },
                    ],
                    createdAt: "2024-03-08T12:00:00Z",
                    updatedAt: "2024-03-08T12:00:00Z",
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Cannot remove the only phase in template",
        }),
        ApiResponse({
            status: 404,
            description: "Template or phase not found",
        })
    );

export const ApiDeleteTemplate = () =>
    applyDecorators(
        ApiOperation({
            summary: "Delete a session template",
            description: `Deletes an existing session template if it's not in use.
            
Features:
- Complete template removal
- Automatic dependency check
- Archive option for used templates

Notes:
- Cannot delete templates in use by active sessions
- Historical data will be preserved
- Associated phases will be removed`,
        }),
        ApiParam({
            name: "id",
            description: "Template identifier",
            example: "550e8400-e29b-41d4-a716-446655440000",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Template deleted successfully",
            schema: {
                example: {
                    success: true,
                    message: "Template successfully deleted",
                    deletedTemplateId: "550e8400-e29b-41d4-a716-446655440000",
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Template is in use by active sessions",
        }),
        ApiResponse({
            status: 404,
            description: "Template not found",
        })
    );

export const ApiUpdateTemplatePhases = () =>
    applyDecorators(
        ApiOperation({
            summary: "Update template phases order and names",
            description: `Updates the order and names of phases in a session template.
            Allows reordering phases and updating their names while maintaining their techniques.`,
        }),
        ApiParam({
            name: "templateId",
            description: "Template identifier",
            example: "template-123",
            required: true,
        }),
        ApiBody({
            description: "Phase updates",
            schema: {
                example: {
                    phases: [
                        {
                            id: "phase-1",
                            name: "Curl-up",
                            order: 1,
                        },
                        {
                            id: "phase-2",
                            name: "Push up",
                            order: 2,
                        },
                        {
                            id: "phase-3",
                            name: "Trunck-lift",
                            order: 3,
                        },
                        {
                            id: "phase-4",
                            name: "Sit & Reach",
                            order: 4,
                        },
                        {
                            id: "phase-5",
                            name: "Pacer",
                            order: 5,
                        },
                    ],
                },
            },
        }),
        ApiResponse({
            status: 200,
            description: "Template phases updated successfully",
            schema: {
                example: {
                    id: "template-123",
                    name: "Strength Training Template",
                    phases: [
                        {
                            id: "phase-1",
                            name: "Curl-up",
                            order: 1,
                            techniques: [
                                {
                                    name: "Basic Curl",
                                    value: "100",
                                    unit: "meters",
                                },
                            ],
                        },
                        {
                            id: "phase-2",
                            name: "Push up",
                            order: 2,
                            techniques: [
                                {
                                    name: "Standard Push-up",
                                    value: "100",
                                    unit: "meters",
                                },
                            ],
                        },
                        {
                            id: "phase-3",
                            name: "Trunck-lift",
                            order: 3,
                            techniques: [
                                {
                                    name: "Basic Lift",
                                    value: "100",
                                    unit: "meters",
                                },
                            ],
                        },
                    ],
                    updatedAt: "2024-03-09T00:00:00Z",
                },
            },
        }),
        ApiResponse({
            status: 400,
            description: "Invalid phase order or names",
        }),
        ApiResponse({
            status: 404,
            description: "Template not found",
        })
    );

export function ApiGetTemplatePhases() {
    return applyDecorators(
        ApiOperation({
            summary: "Get phases for a template",
            description:
                "Retrieves all phases for a specific template with their techniques and ordering",
        }),
        ApiResponse({
            status: 200,
            description: "Template phases retrieved successfully",
            type: GetTemplatePhasesResponseDto,
        }),
        ApiResponse({
            status: 404,
            description: "Template not found",
        }),
        ApiResponse({
            status: 500,
            description: "Internal server error",
        })
    );
}

export const ApiFinishSession = () => {
    return applyDecorators(
        ApiOperation({ summary: "Finish a completed session" }),
        ApiParam({
            name: "id",
            description: "Session ID",
            type: "string",
            required: true,
        }),
        ApiResponse({
            status: 200,
            description: "Session finished successfully",
            type: ClubSession,
        }),
        ApiResponse({
            status: 400,
            description:
                "Session can only be finished when in COMPLETED status",
        }),
        ApiResponse({
            status: 404,
            description: "Session not found",
        })
    );
};

export const ApiSubmitPlayerRevision = applyDecorators(
    ApiOperation({
        summary: "Submit player revision for a session",
        description:
            "Submit a player's revision record for a completed or finished session. Each player can have one revision record with their RPE data and level.",
    }),
    ApiParam({
        name: "id",
        description: "Session ID",
        required: true,
        type: String,
    }),
    ApiBody({
        type: SubmitPlayerRevisionDto,
        description: "Player revision data",
        examples: {
            singlePlayer: {
                summary: "Single player revision",
                value: {
                    revisions: [
                        {
                            playerId: "123e4567-e89b-12d3-a456-426614174000",
                            record: {
                                level: "Professional",
                                rpe: 7,
                                note: "Great session, felt challenging but achievable",
                            },
                        },
                    ],
                },
            },
            multiplePlayers: {
                summary: "Multiple player revisions",
                value: {
                    revisions: [
                        {
                            playerId: "123e4567-e89b-12d3-a456-426614174000",
                            record: {
                                level: "Professional",
                                rpe: 7,
                                note: "Great session, felt challenging but achievable",
                            },
                        },
                        {
                            playerId: "987fcdeb-51d3-a456-426f-987654321000",
                            record: {
                                level: "Amateur",
                                rpe: 8,
                                note: "Intense but productive session",
                            },
                        },
                    ],
                },
            },
        },
    }),
    ApiResponse({
        status: 201,
        description: "Player revision successfully submitted",
        type: ClubSession,
    }),
    ApiResponse({
        status: 404,
        description: "Session not found",
    }),
    ApiResponse({
        status: 400,
        description: "Invalid request or session status",
    })
);

export const ApiGetSessionRevision = applyDecorators(
    ApiOperation({
        summary: "Get session revision details",
        description:
            "Retrieve complete session revision details including player records, sport profile information, and average RPE calculations.",
    }),
    ApiParam({
        name: "id",
        description: "Session ID",
        required: true,
        type: String,
    }),
    ApiResponse({
        status: 200,
        description: "Session revision details retrieved successfully",
        content: {
            "application/json": {
                example: {
                    sessionId: "123e4567-e89b-12d3-a456-426614174000",
                    sessionTitle: "Morning Training Session",
                    sportId: "550e8400-e29b-41d4-a716-446655440001",
                    status: "completed",
                    averageRPE: 7.5,
                    revisions: [
                        {
                            playerId: "123e4567-e89b-12d3-a456-426614174000",
                            playerName: "John Doe",
                            position: "Forward",
                            record: {
                                rpe: 7,
                                note: "Great session, felt challenging but achievable",
                                submittedAt: "2024-03-17T12:00:00Z",
                                level: "Professional",
                            },
                        },
                        {
                            playerId: "987fcdeb-51d3-a456-426f-987654321000",
                            playerName: "Jane Smith",
                            position: "Midfielder",
                            record: null,
                        },
                    ],
                },
            },
        },
    }),
    ApiResponse({
        status: 404,
        description: "Session not found",
        content: {
            "application/json": {
                example: {
                    message: "Session not found",
                    error: "Not Found",
                    statusCode: 404,
                },
            },
        },
    })
);
