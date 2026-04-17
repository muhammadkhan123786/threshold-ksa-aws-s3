import { ApiProperty } from "@nestjs/swagger";

export class AllFitnessTestResultDto {
    @ApiProperty({
        description: "The series number for the fitness data entry",
        example: 1,
    })
    id: number;

    @ApiProperty({
        description: "The date when the fitness test was recorded",
        example: "2024-01-15T00:00:00.000Z",
    })
    date: string;

    @ApiProperty({
        description: "Pacer test value",
        example: 15,
    })
    pacer: number;

    @ApiProperty({
        description: "Sit and reach test value",
        example: 12,
    })
    sit: number;

    @ApiProperty({
        description: "Trunk lift test value",
        example: 10,
    })
    trunk: number;

    @ApiProperty({
        description: "Push-up test value",
        example: 25,
    })
    push: number;

    @ApiProperty({
        description: "Curl-up test value",
        example: 20,
    })
    curl: number;
}
