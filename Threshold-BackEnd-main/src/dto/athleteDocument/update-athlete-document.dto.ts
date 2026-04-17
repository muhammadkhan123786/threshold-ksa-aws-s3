import { IsString, IsEnum, IsOptional } from "class-validator";
import { DocumentType } from "src/enums/document-type.enum";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateAthleteDocumentDto {
    @ApiPropertyOptional({
        description: "The type of the document",
        example: DocumentType.PASSPORT,
    })
    @IsEnum(DocumentType)
    @IsOptional()
    type?: DocumentType;

    @ApiPropertyOptional({
        description: "The URL of the document in the storage service",
        example:
            "https://s3/bucket-name/athletes/123/documents/passport/passport-2024-01-01.pdf",
    })
    @IsString()
    @IsOptional()
    url?: string;
}
