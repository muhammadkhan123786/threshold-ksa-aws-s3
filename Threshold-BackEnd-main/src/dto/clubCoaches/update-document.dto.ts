import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional } from "class-validator";
import { DocumentType } from "src/enums/document-type.enum";

export class UpdateDocumentDto {
    @ApiPropertyOptional({
        description: "Type of the document",
        example: "national_id",
        enum: DocumentType,
    })
    @IsOptional()
    @IsEnum(DocumentType)
    type?: DocumentType;
}
