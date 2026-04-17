import { Injectable, NestMiddleware, Logger } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { ConfigService } from "@nestjs/config";
import * as path from "path";
import { promises as fs } from "fs";

@Injectable()
export class CurlLoggerMiddleware implements NestMiddleware {
    private readonly logger: Logger;
    private readonly logLevel: string;

    constructor(private readonly configService: ConfigService) {
        this.logLevel = this.configService.get<string>("LOG_LEVEL") || "info";
        this.logger = new Logger(CurlLoggerMiddleware.name);
    }

    use(req: Request, res: Response, next: NextFunction): void {
        this.logger.log(
            `[${this.logLevel}] Processing request: ${req.method} ${req.originalUrl}`
        );

        res.on("finish", async () => {
            this.logger.log(
                `[${this.logLevel}] Response status code: ${res.statusCode}`
            );

            if (res.statusCode >= 400) {
                this.logger.error(
                    `[${this.logLevel}] Request failed with status code: ${res.statusCode}`
                );

                try {
                    const curlCommand = this.generateCurlCommand(req);
                    this.logger.error(
                        `[${this.logLevel}] Generated CURL: ${curlCommand}`
                    );

                    const logDir = path.join(__dirname, "../logs");
                    const logFile = path.join(
                        logDir,
                        `error_${res.statusCode}_${Date.now()}.log`
                    );

                    await this.ensureDirectoryExists(logDir);
                    await this.saveLog(logFile, {
                        timestamp: new Date().toISOString(),
                        statusCode: res.statusCode,
                        method: req.method,
                        url: req.originalUrl,
                        curlCommand,
                    });

                    this.logger.log(
                        `[${this.logLevel}] Error details logged to: ${logFile}`
                    );
                } catch (error) {
                    this.logger.error(
                        `[${this.logLevel}] Failed to log error: ${error.message}`
                    );
                }
            }
        });

        next();
    }

    private generateCurlCommand(req: Request): string {
        let curl = `curl -X ${req.method} '${req.protocol}://${req.get("host")}${req.originalUrl}'`;

        const headers = Object.entries(req.headers || {})
            .filter(([key]) => key.toLowerCase() !== "host")
            .map(([key, value]) => `-H '${key}: ${String(value)}'`)
            .join(" ");

        if (headers) {
            curl += ` ${headers}`;
        }

        let bodyData = "";

        if ((req as any).rawBody) {
            bodyData = (req as any).rawBody;
        } else if (
            req.body &&
            typeof req.body === "object" &&
            Object.keys(req.body).length > 0
        ) {
            bodyData = JSON.stringify(req.body);
        }

        if (bodyData) {
            const escapedBody = bodyData.replace(/'/g, `'\\''`);
            curl += ` --data '${escapedBody}'`;
        }

        return curl;
    }

    private async ensureDirectoryExists(dir: string): Promise<void> {
        try {
            await fs.mkdir(dir, { recursive: true });
            this.logger.log(
                `[${this.logLevel}] Log directory verified: ${dir}`
            );
        } catch (err) {
            this.logger.error(
                `[${this.logLevel}] Failed to ensure directory exists: ${err.message}`
            );
            throw err;
        }
    }

    private async saveLog(filePath: string, content: object): Promise<void> {
        try {
            await fs.writeFile(
                filePath,
                JSON.stringify(content, null, 2),
                "utf8"
            );
            this.logger.log(`[${this.logLevel}] Log file created: ${filePath}`);
        } catch (err) {
            this.logger.error(
                `[${this.logLevel}] Failed to write log file: ${err.message}`
            );
            throw err;
        }
    }
}
