import {
    S3Client,
    PutObjectCommand,
    DeleteObjectCommand,
    GetObjectCommand,
} from "@aws-sdk/client-s3";
import { Injectable, BadRequestException } from "@nestjs/common";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class S3Service {
    private s3Client: S3Client;

    constructor() {
        const {
            DO_SPACES_REGION,
            DO_SPACES_ENDPOINT,
            DO_SPACES_KEY,
            DO_SPACES_SECRET,
        } = process.env;

        if (
            !DO_SPACES_REGION ||
            !DO_SPACES_ENDPOINT ||
            !DO_SPACES_KEY ||
            !DO_SPACES_SECRET
        ) {
            throw new BadRequestException(
                "S3 configuration is missing or invalid"
            );
        }

        this.s3Client = new S3Client({
            region: DO_SPACES_REGION,
            endpoint: DO_SPACES_ENDPOINT,
            credentials: {
                accessKeyId: DO_SPACES_KEY,
                secretAccessKey: DO_SPACES_SECRET,
            },
        });
    }

    async uploadFile(
        s3Path: string,
        file: Express.Multer.File
    ): Promise<string> {
        if (!file || !file.originalname) {
            throw new BadRequestException("Invalid file data");
        }

        const key = `${s3Path}/${uuidv4()}-${file.originalname}`;
        const command = new PutObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET_NAME,
            Key: key,
            Body: file.buffer,
            ContentType: file.mimetype,
        });

        await this.s3Client.send(command);

        return key;
    }

    async deleteFile(key: string): Promise<void> {
        if (!key) {
            throw new BadRequestException("Invalid file key");
        }

        const command = new DeleteObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET_NAME,
            Key: key,
        });

        await this.s3Client.send(command);
    }

    async getFileUrl(key: string): Promise<string> {
        if (!key) {
            throw new BadRequestException("Invalid file key");
        }

        const command = new GetObjectCommand({
            Bucket: process.env.DO_SPACES_BUCKET_NAME,
            Key: key,
        });

        const url = await getSignedUrl(this.s3Client, command, {
            expiresIn: 3600,
        });
        return url;
    }
}
