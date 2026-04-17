import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { WorkHistory } from "src/entities/workHistory.entity";
import {
    CreateWorkHistoryDto,
    UpdateWorkHistoryDto,
} from "src/dto/workHistory/work-history.dto";
import { Coach } from "src/entities/coach.entity";
import { ClubAdmin } from "src/entities/clubAdmin.entity";
import { Manager } from "src/entities/manager.entity";
import CustomResponseType from "src/types/customResponseType";

// Define pagination interface locally to avoid import issues
interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

@Injectable()
export class WorkHistoryService {
    private readonly logger = new Logger(WorkHistoryService.name);

    constructor(
        @InjectRepository(WorkHistory)
        private readonly workHistoryRepository: Repository<WorkHistory>,
        @InjectRepository(Coach)
        private readonly coachRepository: Repository<Coach>,
        @InjectRepository(ClubAdmin)
        private readonly clubAdminRepository: Repository<ClubAdmin>,
        @InjectRepository(Manager)
        private readonly managerRepository: Repository<Manager>
    ) {}

    async getWorkHistoryForCoach(
        coachId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<
        CustomResponseType<{ items: WorkHistory[]; meta: PaginationMeta }>
    > {
        try {
            const coach = await this.coachRepository.findOne({
                where: { id: coachId },
            });

            if (!coach) {
                throw new NotFoundException(
                    `Coach with ID ${coachId} not found`
                );
            }

            const [items, total] =
                await this.workHistoryRepository.findAndCount({
                    where: { coach: { id: coachId } },
                    order: { startDate: "DESC" },
                    skip: (page - 1) * limit,
                    take: limit,
                });

            const meta = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };

            return {
                status: 200,
                message: "Work history retrieved successfully",
                payload: { items, meta },
            };
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryForCoach: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async getWorkHistoryForClubAdmin(
        adminId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<
        CustomResponseType<{ items: WorkHistory[]; meta: PaginationMeta }>
    > {
        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
            });

            if (!admin) {
                throw new NotFoundException(
                    `Club Admin with ID ${adminId} not found`
                );
            }

            const [items, total] =
                await this.workHistoryRepository.findAndCount({
                    where: { clubAdmin: { id: adminId } },
                    order: { startDate: "DESC" },
                    skip: (page - 1) * limit,
                    take: limit,
                });

            const meta = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };

            return {
                status: 200,
                message: "Work history retrieved successfully",
                payload: { items, meta },
            };
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryForClubAdmin: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async getWorkHistoryForManager(
        managerId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<
        CustomResponseType<{ items: WorkHistory[]; meta: PaginationMeta }>
    > {
        try {
            const manager = await this.managerRepository.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                throw new NotFoundException(
                    `Manager with ID ${managerId} not found`
                );
            }

            const [items, total] =
                await this.workHistoryRepository.findAndCount({
                    where: { manager: { id: managerId } },
                    order: { startDate: "DESC" },
                    skip: (page - 1) * limit,
                    take: limit,
                });

            const meta = {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            };

            return {
                status: 200,
                message: "Work history retrieved successfully",
                payload: { items, meta },
            };
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryForManager: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async createWorkHistoryForCoach(
        coachId: string,
        createDto: CreateWorkHistoryDto
    ): Promise<CustomResponseType<WorkHistory>> {
        try {
            const coach = await this.coachRepository.findOne({
                where: { id: coachId },
            });

            if (!coach) {
                throw new NotFoundException(
                    `Coach with ID ${coachId} not found`
                );
            }

            const workHistory = this.workHistoryRepository.create({
                ...createDto,
                coach,
            });

            const savedWorkHistory =
                await this.workHistoryRepository.save(workHistory);

            return {
                status: 201,
                message: "Work history created successfully",
                payload: savedWorkHistory,
            };
        } catch (error) {
            this.logger.error(
                `Error in createWorkHistoryForCoach: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async createWorkHistoryForClubAdmin(
        adminId: string,
        createDto: CreateWorkHistoryDto
    ): Promise<CustomResponseType<WorkHistory>> {
        try {
            const admin = await this.clubAdminRepository.findOne({
                where: { id: adminId },
            });

            if (!admin) {
                throw new NotFoundException(
                    `Club Admin with ID ${adminId} not found`
                );
            }

            const workHistory = this.workHistoryRepository.create({
                ...createDto,
                clubAdmin: admin,
            });

            const savedWorkHistory =
                await this.workHistoryRepository.save(workHistory);

            return {
                status: 201,
                message: "Work history created successfully",
                payload: savedWorkHistory,
            };
        } catch (error) {
            this.logger.error(
                `Error in createWorkHistoryForClubAdmin: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async createWorkHistoryForManager(
        managerId: string,
        createDto: CreateWorkHistoryDto
    ): Promise<CustomResponseType<WorkHistory>> {
        try {
            const manager = await this.managerRepository.findOne({
                where: { id: managerId },
            });

            if (!manager) {
                throw new NotFoundException(
                    `Manager with ID ${managerId} not found`
                );
            }

            const workHistory = this.workHistoryRepository.create({
                ...createDto,
                manager,
            });

            const savedWorkHistory =
                await this.workHistoryRepository.save(workHistory);

            return {
                status: 201,
                message: "Work history created successfully",
                payload: savedWorkHistory,
            };
        } catch (error) {
            this.logger.error(
                `Error in createWorkHistoryForManager: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async updateWorkHistory(
        workHistoryId: string,
        updateDto: UpdateWorkHistoryDto
    ): Promise<CustomResponseType<WorkHistory>> {
        try {
            const workHistory = await this.workHistoryRepository.findOne({
                where: { id: workHistoryId },
            });

            if (!workHistory) {
                throw new NotFoundException(
                    `Work history with ID ${workHistoryId} not found`
                );
            }

            Object.assign(workHistory, updateDto);
            const updatedWorkHistory =
                await this.workHistoryRepository.save(workHistory);

            return {
                status: 200,
                message: "Work history updated successfully",
                payload: updatedWorkHistory,
            };
        } catch (error) {
            this.logger.error(
                `Error in updateWorkHistory: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async deleteWorkHistory(
        workHistoryId: string
    ): Promise<CustomResponseType<null>> {
        try {
            const workHistory = await this.workHistoryRepository.findOne({
                where: { id: workHistoryId },
            });

            if (!workHistory) {
                throw new NotFoundException(
                    `Work history with ID ${workHistoryId} not found`
                );
            }

            await this.workHistoryRepository.softDelete(workHistoryId);

            return {
                status: 200,
                message: "Work history deleted successfully",
                payload: null,
            };
        } catch (error) {
            this.logger.error(
                `Error in deleteWorkHistory: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }

    async getWorkHistoryById(
        id: string
    ): Promise<CustomResponseType<WorkHistory>> {
        try {
            const workHistory = await this.workHistoryRepository.findOne({
                where: { id },
            });

            if (!workHistory) {
                throw new NotFoundException(
                    `Work history with ID ${id} not found`
                );
            }

            return {
                status: 200,
                message: "Work history retrieved successfully",
                payload: workHistory,
            };
        } catch (error) {
            this.logger.error(
                `Error in getWorkHistoryById: ${error.message}`,
                error.stack
            );
            throw error;
        }
    }
}
