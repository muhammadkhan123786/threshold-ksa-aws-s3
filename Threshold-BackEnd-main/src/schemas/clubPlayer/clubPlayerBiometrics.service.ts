import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, DeleteResult, Repository, IsNull } from "typeorm";
import {
    ClubPlayerBiometric,
    BMICategory,
    HealthRisk,
} from "src/entities/clubPlayerBiometric.entity";
import { ClubPlayerService } from "./clubPlayer.service";
import { CreateClubPlayerBiometricDto } from "src/dto/clubPlayerBiometrics/create-club-player-biometric.dto";
import { UpdateClubPlayerBiometricDto } from "src/dto/clubPlayerBiometrics/update-club-player-biometric.dto";
import { ClubPlayerBiometricDto } from "src/dto/clubPlayerBiometrics/club-player-biometric.dto";
import CustomResponseType from "src/types/customResponseType";
import { Gender } from "src/enums/athletes.enum";
import {
    deletedRes,
    errorRes,
    foundRes,
    newInstanceRes,
    notFoundRes,
} from "src/lib/responses/restResponse";

interface BMIPercentiles {
    p3: number;
    p15: number;
    p85: number;
    p97: number;
}

@Injectable()
export class ClubPlayerBiometricsService {
    private readonly logger = new Logger(ClubPlayerBiometricsService.name);
    private readonly bmiTable: Map<string, Map<number, BMIPercentiles>> =
        new Map();

    constructor(
        @InjectRepository(ClubPlayerBiometric)
        private readonly biometricRepository: Repository<ClubPlayerBiometric>,
        private readonly clubPlayerService: ClubPlayerService
    ) {
        this.initializeBMITable();
    }

    private initializeBMITable() {
        // Initialize boys' data
        const boysData = new Map<number, BMIPercentiles>();
        // Boys data (age in months)
        boysData.set(60, { p3: 13.1, p15: 14.0, p85: 16.7, p97: 18.1 });
        boysData.set(72, { p3: 13.2, p15: 14.0, p85: 16.8, p97: 18.3 });
        boysData.set(84, { p3: 13.3, p15: 14.1, p85: 17.1, p97: 18.8 });
        boysData.set(96, { p3: 13.4, p15: 14.4, p85: 17.5, p97: 19.4 });
        boysData.set(108, { p3: 13.6, p15: 14.6, p85: 18.0, p97: 20.1 });
        boysData.set(120, { p3: 13.9, p15: 14.9, p85: 18.6, p97: 21.0 });
        boysData.set(132, { p3: 14.2, p15: 15.3, p85: 19.3, p97: 22.0 });
        boysData.set(144, { p3: 14.6, p15: 15.7, p85: 20.1, p97: 23.1 });
        boysData.set(156, { p3: 15.1, p15: 16.3, p85: 20.9, p97: 24.2 });
        boysData.set(168, { p3: 15.6, p15: 16.9, p85: 21.9, p97: 25.3 });
        boysData.set(180, { p3: 16.2, p15: 17.6, p85: 22.8, p97: 26.4 });
        boysData.set(192, { p3: 16.7, p15: 18.2, p85: 23.7, p97: 27.3 });
        boysData.set(204, { p3: 17.1, p15: 18.7, p85: 24.4, p97: 28.0 });
        boysData.set(216, { p3: 17.5, p15: 19.2, p85: 25.0, p97: 28.6 });
        this.bmiTable.set("male", boysData);

        // Initialize girls' data
        const girlsData = new Map<number, BMIPercentiles>();
        // Girls data (age in months)
        girlsData.set(61, { p3: 12.9, p15: 13.8, p85: 16.9, p97: 18.6 });
        girlsData.set(73, { p3: 12.8, p15: 13.8, p85: 17.1, p97: 19.0 });
        girlsData.set(85, { p3: 12.9, p15: 13.9, p85: 17.4, p97: 19.5 });
        girlsData.set(97, { p3: 13.0, p15: 14.1, p85: 17.9, p97: 20.2 });
        girlsData.set(109, { p3: 13.3, p15: 14.4, p85: 18.4, p97: 21.1 });
        girlsData.set(121, { p3: 13.6, p15: 14.8, p85: 19.2, p97: 22.2 });
        girlsData.set(133, { p3: 14.1, p15: 15.3, p85: 20.0, p97: 23.3 });
        girlsData.set(145, { p3: 14.6, p15: 15.9, p85: 20.9, p97: 24.5 });
        girlsData.set(157, { p3: 15.2, p15: 16.6, p85: 22.0, p97: 25.7 });
        girlsData.set(169, { p3: 15.7, p15: 17.2, p85: 22.9, p97: 26.8 });
        girlsData.set(181, { p3: 16.1, p15: 17.7, p85: 23.7, p97: 27.6 });
        girlsData.set(193, { p3: 16.4, p15: 18.1, p85: 24.3, p97: 28.2 });
        girlsData.set(205, { p3: 16.6, p15: 18.3, p85: 24.7, p97: 28.6 });
        girlsData.set(216, { p3: 16.7, p15: 18.5, p85: 24.9, p97: 28.9 });
        this.bmiTable.set("female", girlsData);
    }

    private getBMIPercentiles(
        gender: Gender,
        ageInMonths: number
    ): BMIPercentiles | null {
        if (ageInMonths < 60 || ageInMonths > 216) {
            throw new Error("Age must be between 5 and 18 years");
        }

        const genderData = this.bmiTable.get(gender.toLowerCase());
        if (!genderData) {
            throw new Error("Invalid gender specified");
        }

        // Find the closest age in months using binary search
        const months = Array.from(genderData.keys()).sort((a, b) => a - b);
        let left = 0;
        let right = months.length - 1;

        while (left <= right) {
            const mid = Math.floor((left + right) / 2);
            if (months[mid] === ageInMonths) {
                return genderData.get(months[mid]) || null;
            }
            if (months[mid] < ageInMonths) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }

        // Get the closest age bracket
        const closestMonth = months.reduce((prev, curr) =>
            Math.abs(curr - ageInMonths) < Math.abs(prev - ageInMonths)
                ? curr
                : prev
        );

        return genderData.get(closestMonth) || null;
    }

    private calculateBMIPercentile(
        bmi: number,
        percentiles: BMIPercentiles
    ): number {
        if (!percentiles) {
            throw new Error("BMI percentiles not available");
        }

        // Calculate exact percentile using linear interpolation
        if (bmi < percentiles.p3) return 3;
        if (bmi < percentiles.p15) {
            return (
                3 +
                ((15 - 3) * (bmi - percentiles.p3)) /
                    (percentiles.p15 - percentiles.p3)
            );
        }
        if (bmi < percentiles.p85) {
            return (
                15 +
                ((85 - 15) * (bmi - percentiles.p15)) /
                    (percentiles.p85 - percentiles.p15)
            );
        }
        if (bmi < percentiles.p97) {
            return (
                85 +
                ((97 - 85) * (bmi - percentiles.p85)) /
                    (percentiles.p97 - percentiles.p85)
            );
        }
        return 97;
    }

    private calculateAgeInMonths(dateOfBirth: string): number {
        const birthDate = new Date(dateOfBirth);
        const today = new Date();
        return (
            (today.getFullYear() - birthDate.getFullYear()) * 12 +
            (today.getMonth() - birthDate.getMonth())
        );
    }

    private getBMICategory(
        bmi: number,
        percentiles: BMIPercentiles
    ): BMICategory {
        if (!percentiles) {
            throw new Error("BMI percentiles not available");
        }

        // Determine category based on percentile thresholds
        if (bmi < percentiles.p3) return BMICategory.VERY_LOW;
        if (bmi < percentiles.p15) return BMICategory.LOW;
        if (bmi < percentiles.p85) return BMICategory.NORMAL;
        if (bmi < percentiles.p97) return BMICategory.HIGH;
        return BMICategory.VERY_HIGH;
    }

    private getHealthRisk(bmiCategory: BMICategory): HealthRisk {
        switch (bmiCategory) {
            case BMICategory.VERY_LOW:
                return HealthRisk.VERY_LOW;
            case BMICategory.NORMAL:
                return HealthRisk.HEALTHY_FITNESS;
            case BMICategory.LOW:
            case BMICategory.HIGH:
            case BMICategory.VERY_HIGH:
                return HealthRisk.NEEDS_IMPROVEMENT;
            default:
                throw new Error("Invalid BMI category");
        }
    }

    private calculateBMI(weight: number, height: number): number {
        if (height <= 0 || weight <= 0) {
            throw new Error("Invalid height or weight values");
        }
        // BMI = weight (kg) / (height (m))²
        // Round to 1 decimal place as per WHO standards
        return Number((weight / (height * height)).toFixed(1));
    }

    private calculateAge(dateOfBirth: string): number {
        const today = new Date();
        const birthDate = new Date(dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }

        return age;
    }

    private calculateIdealWeight(
        height: number,
        gender: Gender,
        age: number
    ): { min: number; max: number } {
        if (height <= 0) {
            throw new Error("Invalid height value");
        }

        if (age >= 18) {
            // Adult ideal weight calculations using multiple formulas for accuracy
            const heightInCm = height * 100;
            let idealWeight: number;

            if (gender === Gender.MALE) {
                // Modified Hamwi formula for men
                const baseWeight = 48.0 + 1.1 * (heightInCm - 152.4);
                // Robinson formula for men
                const robinsonWeight = 52 + (1.9 * (heightInCm - 152.4)) / 2.54;
                // Average of both formulas for better accuracy
                idealWeight = (baseWeight + robinsonWeight) / 2;
            } else {
                // Modified Hamwi formula for women
                const baseWeight = 45.5 + 0.9 * (heightInCm - 152.4);
                // Robinson formula for women
                const robinsonWeight = 49 + (1.7 * (heightInCm - 152.4)) / 2.54;
                // Average of both formulas for better accuracy
                idealWeight = (baseWeight + robinsonWeight) / 2;
            }

            // Apply ±10% range for healthy weight variation
            return {
                min: Number((idealWeight * 0.9).toFixed(1)),
                max: Number((idealWeight * 1.1).toFixed(1)),
            };
        } else {
            // Child/adolescent ideal weight calculation using CDC BMI-for-age
            const ageInMonths = this.calculateAgeInMonths(age.toString());
            const percentiles = this.getBMIPercentiles(gender, ageInMonths);

            if (!percentiles) {
                throw new Error("BMI percentiles not available for this age");
            }

            // Use 25th and 75th percentiles for ideal weight range
            return {
                min: Number((percentiles.p15 * height * height).toFixed(1)),
                max: Number((percentiles.p85 * height * height).toFixed(1)),
            };
        }
    }

    private calculateWeightAdjustments(
        currentWeight: number,
        idealMin: number,
        idealMax: number
    ): { weightToLose?: number; weightToGain?: number } {
        if (currentWeight <= 0 || idealMin <= 0 || idealMax <= 0) {
            throw new Error("Invalid weight values");
        }

        if (currentWeight > idealMax) {
            return {
                weightToLose: Number((currentWeight - idealMax).toFixed(1)),
                weightToGain: undefined,
            };
        }
        if (currentWeight < idealMin) {
            return {
                weightToLose: undefined,
                weightToGain: Number((idealMin - currentWeight).toFixed(1)),
            };
        }
        return { weightToLose: undefined, weightToGain: undefined };
    }

    async getBiometricDataForPeriod(
        playerId: string,
        startDate: string,
        endDate: string
    ): Promise<ClubPlayerBiometricDto[]> {
        try {
            const biometricData = await this.biometricRepository.find({
                where: {
                    player: { id: playerId },
                    date: Between(new Date(startDate), new Date(endDate)),
                    deletedAt: IsNull(),
                },
                order: {
                    date: "ASC",
                },
                relations: ["player"],
            });

            return biometricData.map((data) => ({
                date: data.date,
                bmi: data.bmi.toString(),
                weight: data.weight.toString(),
                height: data.height.toString(),
                bmiCategory: data.bmiCategory,
                healthRisk: data.healthRisk,
                idealWeightMin: data.idealWeightMin.toString(),
                idealWeightMax: data.idealWeightMax.toString(),
                weightToLose: data.weightToLose?.toString(),
                weightToGain: data.weightToGain?.toString(),
                notes: data.notes,
                bmiPercentile: data.bmiPercentile.toString(),
                p3: data.p3?.toString(),
                p15: data.p15?.toString(),
                p85: data.p85?.toString(),
                p97: data.p97?.toString(),
            }));
        } catch (error) {
            throw new Error(
                `Error retrieving biometric data: ${error.message}`
            );
        }
    }

    async getBiometricById(
        id: string
    ): Promise<CustomResponseType<ClubPlayerBiometric>> {
        try {
            const biometric = await this.biometricRepository.findOne({
                where: { id },
                relations: ["player"],
            });

            if (!biometric) {
                return notFoundRes("Biometric record not found");
            }

            return foundRes("Biometric record found", biometric);
        } catch (error) {
            this.logger.error(
                `Error fetching biometric record: ${error.message}`
            );
            return errorRes(error.message);
        }
    }

    async createBiometric(
        createDto: CreateClubPlayerBiometricDto
    ): Promise<CustomResponseType<ClubPlayerBiometric>> {
        try {
            const { playerId, ...data } = createDto;
            const playerResponse =
                await this.clubPlayerService.getPlayerById(playerId);
            if (playerResponse.status !== 200) {
                return notFoundRes("Player not found");
            }

            const player = playerResponse.payload;
            const ageInMonths = this.calculateAgeInMonths(player.dateOfBirth);
            const bmi = this.calculateBMI(data.weight, data.height);

            const percentiles = this.getBMIPercentiles(
                player.gender as Gender,
                ageInMonths
            );
            if (!percentiles) {
                return errorRes(
                    "Could not determine BMI percentiles for player's age and gender"
                );
            }

            const bmiCategory = this.getBMICategory(bmi, percentiles);
            const healthRisk = this.getHealthRisk(bmiCategory);

            const biometric = this.biometricRepository.create({
                ...data,
                bmi,
                bmiCategory,
                healthRisk,
                bmiPercentile: this.calculateBMIPercentile(bmi, percentiles),
                p3: percentiles.p3,
                p15: percentiles.p15,
                p85: percentiles.p85,
                p97: percentiles.p97,
                player,
            });

            const savedBiometric =
                await this.biometricRepository.save(biometric);
            return newInstanceRes(
                "Biometric record created successfully",
                savedBiometric
            );
        } catch (error) {
            this.logger.error(
                `Error creating biometric record: ${error.message}`
            );
            return errorRes(error.message);
        }
    }

    async updateBiometric(
        id: string,
        updateDto: UpdateClubPlayerBiometricDto
    ): Promise<CustomResponseType<ClubPlayerBiometric>> {
        try {
            const biometric = await this.biometricRepository.findOne({
                where: { id },
                relations: ["player"],
            });

            if (!biometric) {
                return notFoundRes("Biometric record not found");
            }

            if (updateDto.weight || updateDto.height) {
                const weight = updateDto.weight || biometric.weight;
                const height = updateDto.height || biometric.height;
                const age = this.calculateAge(biometric.player.dateOfBirth);
                const bmi = this.calculateBMI(weight, height);
                const bmiCategory = this.getBMICategory(
                    bmi,
                    this.getBMIPercentiles(
                        biometric.player.gender as Gender,
                        this.calculateAgeInMonths(biometric.player.dateOfBirth)
                    )
                );
                const healthRisk = this.getHealthRisk(bmiCategory);
                const { min: idealWeightMin, max: idealWeightMax } =
                    this.calculateIdealWeight(
                        height,
                        biometric.player.gender as Gender,
                        age
                    );
                const { weightToLose, weightToGain } =
                    this.calculateWeightAdjustments(
                        weight,
                        idealWeightMin,
                        idealWeightMax
                    );

                Object.assign(updateDto, {
                    bmi,
                    bmiCategory,
                    healthRisk,
                    idealWeightMin,
                    idealWeightMax,
                    weightToLose,
                    weightToGain,
                });
            }

            const updatedBiometric = await this.biometricRepository.save({
                ...biometric,
                ...updateDto,
            });

            return foundRes(
                "Biometric record updated successfully",
                updatedBiometric
            );
        } catch (error) {
            this.logger.error(
                `Error updating biometric record: ${error.message}`
            );
            return errorRes(error.message);
        }
    }

    async deleteBiometric(
        id: string
    ): Promise<CustomResponseType<DeleteResult>> {
        try {
            const result = await this.biometricRepository.delete(id);

            if (result.affected === 0) {
                return notFoundRes("Biometric record not found");
            }

            return deletedRes("Biometric record deleted successfully", result);
        } catch (error) {
            this.logger.error(
                `Error deleting biometric record: ${error.message}`
            );
            return errorRes(error.message);
        }
    }
}
