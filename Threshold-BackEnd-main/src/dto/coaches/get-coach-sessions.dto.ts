import { IsString, IsOptional } from "class-validator";

export class GetCoachSessionsDto {
    @IsString()
    @IsOptional()
    date?: string;
}
