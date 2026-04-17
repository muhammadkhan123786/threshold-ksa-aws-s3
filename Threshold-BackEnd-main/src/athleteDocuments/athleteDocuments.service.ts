import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { S3Service } from "../s3/s3.service";
import { Athlete } from "src/entities/athlete.entity";
import { AthleteDocument } from "src/entities/athleteDocument.entity";
import { UpdateAthleteDocumentDto } from "src/dto/athleteDocument/update-athlete-document.dto";
import { DocumentType } from "src/enums/document-type.enum";
import { errorRes, foundRes } from "src/lib/responses/restResponse";
import CustomResponseType from "src/types/customResponseType";

@Injectable()
export class AthleteDocumentsService {
    private readonly logger = new Logger(AthleteDocumentsService.name);

    constructor(
        @InjectRepository(AthleteDocument)
        private readonly athleteDocumentRepository: Repository<AthleteDocument>,
        @InjectRepository(Athlete)
        private readonly athleteRepository: Repository<Athlete>,
        private readonly s3Service: S3Service
    ) {}

    private generateS3Path(
        athleteId: string,
        documentType: DocumentType,
        fileName: string
    ): string {
        return `athletes/${athleteId}/documents/${documentType}/${fileName}`;
    }

    async uploadDocument(
        athleteId: string,
        file: Express.Multer.File,
        type: DocumentType
    ): Promise<CustomResponseType<AthleteDocument>> {
        this.logger.log(
            `Uploading document for athlete ID: ${athleteId}, type: ${type}`
        );

        try {
            const athlete = await this.athleteRepository.findOne({
                where: { id: athleteId },
            });
            if (!athlete) {
                this.logger.warn(`Athlete not found: ${athleteId}`);
                return errorRes("Athlete not found");
            }

            const fileName = `${type}-${new Date().toISOString()}.${file.originalname.split(".").pop()}`;
            const s3Path = this.generateS3Path(athleteId, type, fileName);

            const url = await this.s3Service.uploadFile(s3Path, file);
            this.logger.log(`Document uploaded to S3 at path: ${s3Path}`);

            const document = this.athleteDocumentRepository.create({
                type,
                url,
                athlete,
                lastUpdated: new Date(),
            });

            const result = await this.athleteDocumentRepository.save(document);
            return foundRes("Document uploaded successfully", result);
        } catch (error) {
            this.logger.error(
                `Failed to upload document for athlete ID: ${athleteId}`,
                error.stack
            );
            return errorRes("Failed to upload document");
        }
    }

    async deleteDocument(
        athleteId: string,
        documentId: string
    ): Promise<CustomResponseType<AthleteDocument>> {
        this.logger.log(
            `Deleting document for athlete ID: ${athleteId}, documentId: ${documentId}`
        );

        try {
            const document = await this.athleteDocumentRepository.findOne({
                where: { id: documentId, athlete: { id: athleteId } },
            });

            if (!document) {
                this.logger.warn(
                    `Document not found: ${documentId} for athlete ID: ${athleteId}`
                );
                return errorRes("Document not found");
            }

            await this.s3Service.deleteFile(document.url);

            await this.athleteDocumentRepository.remove(document);

            this.logger.log(`Document deleted successfully: ${documentId}`);
            return foundRes("Document deleted successfully", document);
        } catch (error) {
            this.logger.error(
                `Failed to delete document ID: ${documentId} for athlete ID: ${athleteId}`,
                error.stack
            );
            return errorRes("Failed to delete document");
        }
    }

    async getDocumentsByAthleteId(
        athleteId: string
    ): Promise<CustomResponseType<AthleteDocument[]>> {
        this.logger.log(`Fetching documents for athlete ID: ${athleteId}`);

        try {
            const athlete = await this.athleteRepository.findOne({
                where: { id: athleteId },
            });
            if (!athlete) {
                this.logger.warn(`Athlete not found: ${athleteId}`);
                return errorRes("Athlete not found");
            }

            const documents = await this.athleteDocumentRepository.find({
                where: { athlete: { id: athleteId } },
            });

            const documentsWithUrls = await Promise.all(
                documents.map(async (document) => {
                    const signedUrl = await this.s3Service.getFileUrl(
                        document.url
                    );
                    return {
                        ...document,
                        signedUrl,
                    };
                })
            );

            return foundRes(
                "Documents fetched successfully",
                documentsWithUrls
            );
        } catch (error) {
            this.logger.error(
                `Failed to fetch documents for athlete ID: ${athleteId}`,
                error.stack
            );
            return errorRes("Failed to fetch documents");
        }
    }

    async updateDocument(
        athleteId: string,
        documentId: string,
        updateAthleteDocumentDto: UpdateAthleteDocumentDto,
        file?: Express.Multer.File
    ): Promise<CustomResponseType<AthleteDocument>> {
        this.logger.log(
            `Updating document ID: ${documentId} for athlete ID: ${athleteId}`
        );

        try {
            const document = await this.athleteDocumentRepository.findOne({
                where: { id: documentId, athlete: { id: athleteId } },
            });

            if (!document) {
                this.logger.warn(
                    `Document not found: ${documentId} for athlete ID: ${athleteId}`
                );
                return errorRes("Document not found");
            }

            if (file) {
                const s3Path = this.generateS3Path(
                    athleteId,
                    document.type,
                    file.originalname
                );
                const newUrl = await this.s3Service.uploadFile(s3Path, file);
                await this.s3Service.deleteFile(document.url);
                document.url = newUrl;
            }

            Object.assign(document, updateAthleteDocumentDto, {
                lastUpdated: new Date(),
            });

            const result = await this.athleteDocumentRepository.save(document);
            return foundRes("Document updated successfully", result);
        } catch (error) {
            this.logger.error(
                `Failed to update document ID: ${documentId} for athlete ID: ${athleteId}`,
                error.stack
            );
            return errorRes("Failed to update document");
        }
    }
}
