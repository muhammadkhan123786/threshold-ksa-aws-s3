import { Injectable, NotFoundException, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AthleteRecord } from "src/entities/athleteRecord.entity";
import { Athlete } from "src/entities/athlete.entity";
import { CreateAthleteRecordDto } from "src/dto/athleteRecord/create-athlete-record.dto";
import { UpdateAthleteRecordDto } from "src/dto/athleteRecord/update-athlete-record.dto";

@Injectable()
export class AthleteRecordService {
    private readonly logger = new Logger(AthleteRecordService.name);

    constructor(
        @InjectRepository(AthleteRecord)
        private readonly athleteRecordRepository: Repository<AthleteRecord>,
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>
    ) {}

    async createRecord(
        athleteId: string,
        createAthleteRecordDto: CreateAthleteRecordDto
    ): Promise<AthleteRecord> {
        this.logger.log(
            `Creating a new record for athlete with ID: ${athleteId}`
        );

        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
        });

        if (!athlete) {
            this.logger.warn(`Athlete not found with ID: ${athleteId}`);
            throw new NotFoundException("Athlete not found");
        }

        const record = this.athleteRecordRepository.create({
            ...createAthleteRecordDto,
            athlete,
        });

        const savedRecord = await this.athleteRecordRepository.save(record);
        this.logger.log(
            `Record created successfully for athlete with ID: ${athleteId}`
        );

        return savedRecord;
    }

    async updateRecord(
        athleteId: string,
        recordId: string,
        updateAthleteRecordDto: UpdateAthleteRecordDto
    ): Promise<AthleteRecord> {
        this.logger.log(
            `Updating record with ID: ${recordId} for athlete with ID: ${athleteId}`
        );

        const record = await this.athleteRecordRepository.findOne({
            where: { id: recordId, athlete: { id: athleteId } },
        });

        if (!record) {
            this.logger.warn(
                `Record not found with ID: ${recordId} for athlete with ID: ${athleteId}`
            );
            throw new NotFoundException("Record not found");
        }

        Object.assign(record, updateAthleteRecordDto);
        const updatedRecord = await this.athleteRecordRepository.save(record);
        this.logger.log(
            `Record with ID: ${recordId} updated successfully for athlete with ID: ${athleteId}`
        );

        return updatedRecord;
    }

    async softDeleteRecord(athleteId: string, recordId: string): Promise<void> {
        this.logger.log(
            `Soft deleting record with ID: ${recordId} for athlete with ID: ${athleteId}`
        );

        const record = await this.athleteRecordRepository.findOne({
            where: { id: recordId, athlete: { id: athleteId } },
        });

        if (!record) {
            this.logger.warn(
                `Record not found with ID: ${recordId} for athlete with ID: ${athleteId}`
            );
            throw new NotFoundException("Record not found");
        }

        await this.athleteRecordRepository.softRemove(record);
        this.logger.log(
            `Record with ID: ${recordId} soft deleted successfully`
        );
    }

    async getRecordsByAthleteId(athleteId: string): Promise<AthleteRecord[]> {
        this.logger.log(`Fetching records for athlete with ID: ${athleteId}`);

        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
        });

        if (!athlete) {
            this.logger.warn(`Athlete not found with ID: ${athleteId}`);
            throw new NotFoundException("Athlete not found");
        }

        const records = await this.athleteRecordRepository.find({
            where: { athlete: { id: athleteId } },
        });

        this.logger.log(
            `Records retrieved successfully for athlete with ID: ${athleteId}`
        );
        return records;
    }
}
