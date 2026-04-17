import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UseGuards,
    Res,
    HttpStatus,
    Logger,
    Req,
} from "@nestjs/common";
import { Response, Request } from "express";
import { ApiTags, ApiBody, ApiParam } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/guards/jwt.guard";
import { RolesGuard } from "src/auth/guards/roles.guard";
import { Roles } from "src/auth/decorators/roles.decorator";
import { UserRole } from "src/enums/users.enum";
import { ContractAuditService } from "./contractAudit.service";
import {
    CreateContractAuditDto,
    GetContractAuditQueryDto,
} from "src/dto/contracts/contract-audit.dto";
import {
    ApiGetAuditHistory,
    ApiGetAuditEntryById,
    ApiCreateAuditEntry,
    ApiCompareContractVersions,
    SWAGGER_CONTRACT_AUDIT,
} from "./contractAudit.swagger.decorator";

@ApiTags("Contract Audit")
@Controller("contracts")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ContractAuditController {
    private readonly logger = new Logger(ContractAuditController.name);

    constructor(private readonly contractAuditService: ContractAuditService) {}

    @Get(":contractId/audit")
    @ApiGetAuditHistory()
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async getAuditHistory(
        @Param("contractId") contractId: string,
        @Query("page") page: number = 1,
        @Query("limit") limit: number = 10,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.contractAuditService.getAuditHistoryForContract(
                    contractId,
                    page,
                    limit
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in getAuditHistory: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving contract audit history",
                error: error.message,
            });
        }
    }

    @Post(":contractId/audit")
    @ApiCreateAuditEntry()
    @ApiBody({ type: CreateContractAuditDto })
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async createAuditEntry(
        @Param("contractId") contractId: string,
        @Body() createDto: CreateContractAuditDto,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const userId = req.user["id"];
            const result = await this.contractAuditService.createAuditEntry(
                contractId,
                userId,
                createDto
            );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in createAuditEntry: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error creating contract audit entry",
                error: error.message,
            });
        }
    }

    @Get("audit/:auditId")
    @ApiGetAuditEntryById()
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async getAuditEntryById(
        @Param("auditId") auditId: string,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.contractAuditService.getAuditEntryById(auditId);
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in getAuditEntryById: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error retrieving contract audit entry",
                error: error.message,
            });
        }
    }

    @Get(":contractId/compare")
    @ApiCompareContractVersions()
    @Roles(
        UserRole.ADMIN,
        UserRole.ACADEMY_ADMIN,
        UserRole.CLUB_ADMIN,
        UserRole.ADMIN_MANAGER
    )
    async compareContractVersions(
        @Param("contractId") contractId: string,
        @Query("auditId1") auditId1: string,
        @Query("auditId2") auditId2: string,
        @Res() res: Response
    ) {
        try {
            const result =
                await this.contractAuditService.compareContractVersions(
                    contractId,
                    auditId1,
                    auditId2
                );
            return res.status(result.status).json(result);
        } catch (error) {
            this.logger.error(
                `Error in compareContractVersions: ${error.message}`,
                error.stack
            );
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                message: "Error comparing contract versions",
                error: error.message,
            });
        }
    }
}
