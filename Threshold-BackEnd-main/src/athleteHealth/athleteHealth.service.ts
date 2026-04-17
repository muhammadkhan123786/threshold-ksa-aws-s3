import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Athlete } from "src/entities/athlete.entity";
import { CreateHealthRecordDto } from "src/dto/athleteHealth/create-health-record.dto";
import { AthleteHealthRecords } from "src/entities/athleteHealthRecords.entity";
import { S3Service } from "src/s3/s3.service";
import { UpdateHealthRecordDto } from "src/dto/athleteHealth/update-health-record.dto";
import { UpdateMedicalInfoDto } from "src/dto/athleteHealth/update-medical-Info.dto";

@Injectable()
export class AthleteHealthService {
    constructor(
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        private readonly s3Service: S3Service
    ) {}

    private generateS3Path(athleteId: string, fileName: string): string {
        return `athletes/${athleteId}/medical/${fileName}`;
    }
    async updateMedicalInfo(
        athleteId: string,
        updateMedicalInfoDto: UpdateMedicalInfoDto,
        foodAllergiesFile?: Express.Multer.File,
        currentConsiderationFile?: Express.Multer.File
    ): Promise<Athlete> {
        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
            relations: ["healthRecords"],
        });

        if (!athlete) {
            throw new NotFoundException("Athlete not found");
        }

        if (foodAllergiesFile) {
            const fileName = `foodAllergies-${new Date().toISOString()}.${foodAllergiesFile.originalname.split(".").pop()}`;

            const s3Path = this.generateS3Path(athleteId, fileName);
            const url = await this.s3Service.uploadFile(
                s3Path,
                foodAllergiesFile
            );
            updateMedicalInfoDto.foodAllergiesUrl = url;
        }

        if (currentConsiderationFile) {
            const fileName = `currentConsideration-${new Date().toISOString()}.${currentConsiderationFile.originalname.split(".").pop()}`;
            const s3Path = this.generateS3Path(athleteId, fileName);
            const url = await this.s3Service.uploadFile(
                s3Path,
                currentConsiderationFile
            );
            updateMedicalInfoDto.considerationUrl = url;
        }

        Object.assign(athlete, updateMedicalInfoDto);
        return this.athleteRepository.save(athlete);
    }

    async getMedicalInfo(athleteId: string): Promise<Athlete> {
        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
        });

        if (!athlete) {
            throw new NotFoundException("Athlete not found");
        }

        if (athlete.foodAllergiesUrl) {
            athlete.foodAllergiesUrl = await this.s3Service.getFileUrl(
                athlete.foodAllergiesUrl
            );
        }

        if (athlete.considerationUrl) {
            athlete.considerationUrl = await this.s3Service.getFileUrl(
                athlete.considerationUrl
            );
        }

        return athlete;
    }

    async createHealthRecord(
        athleteId: string,
        createHealthRecordDto: CreateHealthRecordDto
    ): Promise<AthleteHealthRecords[]> {
        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
            relations: ["healthRecords"],
        });

        if (!athlete) {
            throw new NotFoundException("Athlete not found");
        }

        const healthRecord = new AthleteHealthRecords();
        Object.assign(healthRecord, createHealthRecordDto);
        healthRecord.dateOfUpdating = new Date();
        athlete.healthRecords.push(healthRecord);

        const athleteResult = await this.athleteRepository.save(athlete);
        return athleteResult.healthRecords;
    }

    async updateHealthRecord(
        athleteId: string,
        healthRecordId: string,
        updateHealthRecordDto: UpdateHealthRecordDto
    ): Promise<AthleteHealthRecords> {
        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
            relations: ["healthRecords"],
        });

        if (!athlete) {
            throw new NotFoundException("Athlete not found");
        }

        const healthRecord = athlete.healthRecords.find(
            (record) => record.id === healthRecordId
        );
        if (!healthRecord) {
            throw new NotFoundException("Health record not found");
        }

        Object.assign(healthRecord, updateHealthRecordDto);
        healthRecord.dateOfUpdating = new Date();

        await this.athleteRepository.save(athlete);

        return healthRecord;
    }

    async getHealthRecords(athleteId: string): Promise<AthleteHealthRecords[]> {
        const athlete = await this.athleteRepository.findOne({
            where: { id: athleteId },
            relations: ["healthRecords"],
        });

        if (!athlete) {
            throw new NotFoundException("Athlete not found");
        }

        return athlete.healthRecords;
    }
}
