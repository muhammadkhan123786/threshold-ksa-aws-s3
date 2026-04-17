import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    ManyToOne,
    JoinColumn,
} from "typeorm";
import { Athlete } from "src/entities/athlete.entity";

/**
 * BMI Categories based on WHO standards and age-specific percentiles
 * For children and adolescents (5-19 years):
 * - Very Low: < 3rd percentile
 * - Low: 3rd to < 15th percentile
 * - Normal: 15th to < 85th percentile
 * - High: 85th to < 97th percentile
 * - Very High: ≥ 97th percentile
 */
export enum BMICategory {
    VERY_LOW = "Very Low",           // < P3
    LOW = "Low",                     // P3-P15
    NORMAL = "Normal",               // P15-P85
    HIGH = "High",                   // P85-P97
    VERY_HIGH = "Very High"          // > P97
}

/**
 * Health Risk Categories based on FITNESSGRAM® standards
 * - NEEDS_IMPROVEMENT: Indicates increased health risks
 * - HEALTHY_FITNESS: Indicates acceptable health level
 * - VERY_LOW: Indicates potential malnutrition risks
 */
export enum HealthRisk {
    NEEDS_IMPROVEMENT = "Needs Improvement",
    HEALTHY_FITNESS = "Healthy Fitness Zone",
    VERY_LOW = "Very Low"
}

@Entity()
export class ClubPlayerBiometric {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;

    @DeleteDateColumn({ type: "timestamp", nullable: true })
    deletedAt?: Date;

    @Column({ type: "date" })
    date: Date;

    @Column({ type: "decimal", precision: 5, scale: 2, comment: "Weight in kilograms" })
    weight: number;

    @Column({ type: "decimal", precision: 5, scale: 2, comment: "Height in meters" })
    height: number;

    @Column({ type: "decimal", precision: 5, scale: 2, comment: "Body Mass Index (kg/m²)" })
    bmi: number;

    @Column({ type: "enum", enum: BMICategory, comment: "BMI category based on age-specific percentiles" })
    bmiCategory: BMICategory;

    @Column({ type: "enum", enum: HealthRisk, comment: "Health risk assessment based on BMI category" })
    healthRisk: HealthRisk;

    @Column({ type: "decimal", precision: 5, scale: 2, comment: "Minimum healthy weight based on height and age (kg)" })
    idealWeightMin: number;

    @Column({ type: "decimal", precision: 5, scale: 2, comment: "Maximum healthy weight based on height and age (kg)" })
    idealWeightMax: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, comment: "Weight to lose to reach healthy range (kg)" })
    weightToLose?: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, comment: "Weight to gain to reach healthy range (kg)" })
    weightToGain?: number;

    @Column({ type: "text", nullable: true, comment: "Additional observations or recommendations" })
    notes?: string;

    @Column({ type: "decimal", precision: 5, scale: 2, comment: "BMI percentile relative to age and gender" })
    bmiPercentile: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, comment: "3rd percentile BMI threshold" })
    p3: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, comment: "15th percentile BMI threshold" })
    p15: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, comment: "85th percentile BMI threshold" })
    p85: number;

    @Column({ type: "decimal", precision: 5, scale: 2, nullable: true, comment: "97th percentile BMI threshold" })
    p97: number;

    @ManyToOne(() => Athlete, (athlete) => athlete.athleteBiometrics)
    @JoinColumn()
    player: Athlete;
}
