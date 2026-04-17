import {
    AthleteLevel,
    Education,
    Gender,
} from "src/enums/athletes.enum";
import {
    IsDate,
    IsString,
    IsUUID,
    IsEnum,
    IsOptional,
    IsNumber,
    ValidateNested,
} from "class-validator";
import { Transform, Type } from "class-transformer";
import { AthleteClothing } from "src/entities/athleteClothing.entity";
import { AthleteBankDetails } from "src/entities/athleteBankDetails.entity";
import { EmergencyContact } from "src/entities/emergencyContact.entity";
import { Team } from "src/entities/team.entity";
import { FirstArrayItemOrDefault } from "src/lib/helpers/stringHelpers";
import { ApiProperty } from "@nestjs/swagger";

export class AthleteDetailsDto {
    @IsUUID()
    id: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: "John",
        description: "The first name of the athlete.",
    })
    firstName?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: "Smith",
        description: "The last name of the athlete.",
    })
    lastName?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    joinDate?: Date;

    @IsOptional()
    @IsEnum(AthleteLevel)
    level?: AthleteLevel;

    @IsOptional()
    @IsEnum(Education)
    education?: Education;

    @IsOptional()
    @IsString()
    schoolName?: string;

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    dateOfBirth?: Date;

    @IsOptional()
    @IsEnum(Gender)
    gender?: Gender;

    @IsOptional()
    @IsString()
    nin?: string;

    @IsOptional()
    @IsString()
    @ApiProperty({
        example: "Saudi Arabia",
        description: "The nationality of the athlete.",
    })
    nationality?: string;

    @IsOptional()
    @IsNumber()
    weight?: number;

    @IsOptional()
    @IsNumber()
    height?: number;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AthleteClothing)
    athleteClothing?: AthleteClothing;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => AthleteBankDetails)
    bankDetails?: AthleteBankDetails;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => Team)
    @FirstArrayItemOrDefault(Team)
    teams?: Team;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => EmergencyContact)
    emergencyContact?: EmergencyContact;
}
