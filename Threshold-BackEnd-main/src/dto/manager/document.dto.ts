import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";
import { DocumentType } from "src/enums/document-type.enum";

export class CreateDocumentDto {
    @ApiProperty({
        example: "Employment Contract",
        description: "Name of the document",
    })
    @IsString()
    name: string;

    @ApiProperty({
        example: DocumentType.CONTRACT,
        description: "Type of the document",
        enum: DocumentType,
    })
    @IsString()
    type: DocumentType;
}

export class UpdateDocumentDto {
    @ApiProperty({
        example: "Updated Employment Contract",
        description: "Updated name of the document",
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({
        example: DocumentType.CONTRACT,
        description: "Updated type of the document",
        enum: DocumentType,
    })
    @IsOptional()
    @IsString()
    type?: DocumentType;
}
