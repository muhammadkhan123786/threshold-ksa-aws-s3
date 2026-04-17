import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ContractAudit, AuditAction } from "src/entities/contractAudit.entity";
import { Contract } from "src/entities/contract.entity";
import { User } from "src/entities/user.entity";
import { CreateContractAuditDto } from "src/dto/contracts/contract-audit.dto";
import CustomResponseType from "src/types/customResponseType";

@Injectable()
export class ContractAuditService {
    private readonly logger = new Logger(ContractAuditService.name);

    constructor(
        @InjectRepository(ContractAudit)
        private readonly contractAuditRepository: Repository<ContractAudit>,
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createAuditEntry(
        contractId: string,
        userId: string,
        auditData: CreateContractAuditDto
    ): Promise<CustomResponseType<ContractAudit>> {
        try {
            const contract = await this.contractRepository.findOne({
                where: { id: contractId },
            });

            if (!contract) {
                throw new NotFoundException(`Contract with ID ${contractId} not found`);
            }

            const user = await this.userRepository.findOne({
                where: { id: userId },
            });

            if (!user) {
                throw new NotFoundException(`User with ID ${userId} not found`);
            }

            const auditEntry = this.contractAuditRepository.create({
                contract,
                contractId,
                performedBy: user,
                action: auditData.action,
                previousValues: auditData.previousValues,
                newValues: auditData.newValues,
                comments: auditData.comments,
            });

            const savedAudit = await this.contractAuditRepository.save(auditEntry);

            return {
                status: 201,
                message: "Contract audit entry created successfully",
                payload: savedAudit,
            };
        } catch (error) {
            this.logger.error(`Error in createAuditEntry: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getAuditHistoryForContract(
        contractId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<CustomResponseType<{ items: ContractAudit[], total: number }>> {
        try {
            const contract = await this.contractRepository.findOne({
                where: { id: contractId },
            });

            if (!contract) {
                throw new NotFoundException(`Contract with ID ${contractId} not found`);
            }

            const [items, total] = await this.contractAuditRepository.findAndCount({
                where: { contractId },
                relations: ['performedBy'],
                order: { timestamp: "DESC" },
                skip: (page - 1) * limit,
                take: limit,
            });

            return {
                status: 200,
                message: "Contract audit history retrieved successfully",
                payload: { items, total },
            };
        } catch (error) {
            this.logger.error(`Error in getAuditHistoryForContract: ${error.message}`, error.stack);
            throw error;
        }
    }

    async getAuditEntryById(id: string): Promise<CustomResponseType<ContractAudit>> {
        try {
            const auditEntry = await this.contractAuditRepository.findOne({
                where: { id },
                relations: ['performedBy', 'contract'],
            });

            if (!auditEntry) {
                throw new NotFoundException(`Audit entry with ID ${id} not found`);
            }

            return {
                status: 200,
                message: "Contract audit entry retrieved successfully",
                payload: auditEntry,
            };
        } catch (error) {
            this.logger.error(`Error in getAuditEntryById: ${error.message}`, error.stack);
            throw error;
        }
    }

    async compareContractVersions(
        contractId: string, 
        auditId1: string, 
        auditId2?: string
    ): Promise<CustomResponseType<{ differences: any }>> {
        try {
            // If auditId2 is not provided, compare the audit entry with the current contract state
            let version1: any, version2: any;

            const audit1 = await this.contractAuditRepository.findOne({
                where: { id: auditId1 },
            });

            if (!audit1) {
                throw new NotFoundException(`Audit entry with ID ${auditId1} not found`);
            }

            if (auditId2) {
                const audit2 = await this.contractAuditRepository.findOne({
                    where: { id: auditId2 },
                });

                if (!audit2) {
                    throw new NotFoundException(`Audit entry with ID ${auditId2} not found`);
                }

                version1 = audit1.newValues || audit1.previousValues;
                version2 = audit2.newValues || audit2.previousValues;
            } else {
                const contract = await this.contractRepository.findOne({
                    where: { id: contractId },
                });

                if (!contract) {
                    throw new NotFoundException(`Contract with ID ${contractId} not found`);
                }

                version1 = audit1.newValues || audit1.previousValues;
                version2 = {
                    type: contract.type,
                    joinDate: contract.joinDate,
                    expirationDate: contract.expirationDate,
                    contractDuration: contract.contractDuration,
                    status: contract.status,
                };
            }

            const differences = this.findDifferences(version1, version2);

            return {
                status: 200,
                message: "Contract versions compared successfully",
                payload: { differences },
            };
        } catch (error) {
            this.logger.error(`Error in compareContractVersions: ${error.message}`, error.stack);
            throw error;
        }
    }

    private findDifferences(obj1: any, obj2: any): any {
        const differences = {};

        // Check for keys in obj1
        for (const key in obj1) {
            if (JSON.stringify(obj1[key]) !== JSON.stringify(obj2[key])) {
                differences[key] = {
                    oldValue: obj1[key],
                    newValue: obj2[key],
                };
            }
        }

        // Check for keys in obj2 that are not in obj1
        for (const key in obj2) {
            if (!(key in obj1)) {
                differences[key] = {
                    oldValue: undefined,
                    newValue: obj2[key],
                };
            }
        }

        return differences;
    }
} 