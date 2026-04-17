import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { DocumentType } from "src/enums/document-type.enum";

export class CreateDocumentDto {
    @ApiProperty({
        description: "Type of the document",
        example: DocumentType.NATIONAL_ID,
        enum: DocumentType,
    })
    @IsEnum(DocumentType)
    type: DocumentType;
}
