import { Injectable, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
    createLogger,
    format,
    transports,
    Logger as WinstonLogger,
} from "winston";
import * as ElasticsearchTransport from "winston-elasticsearch";
import TransportStream from "winston-transport";

@Injectable()
export class LoggerService implements OnModuleInit {
    private logger: WinstonLogger | null = null;

    constructor(private readonly configService: ConfigService) {}

    /**
     * Lifecycle hook to initialize the logger once the module is ready.
     */
    onModuleInit(): void {
        try {
            this.logger = this.createLogger();
            this.logger.info("Logger initialized successfully.");
        } catch (error) {
            console.error("Failed to initialize logger:", error.message);
        }
    }

    /**
     * Creates and configures the Winston logger.
     * @returns {WinstonLogger} Configured Winston logger instance.
     */
    private createLogger(): WinstonLogger {
        const elasticsearchNode = this.configService.get<string>(
            "ELASTICSEARCH_NODE",
            "http://localhost:9200"
        );
        const logLevel = this.configService.get<string>("LOG_LEVEL", "info");
        const environment = this.configService.get<string>(
            "NODE_ENV",
            "development"
        );
        const enableElasticsearch = this.configService.get<boolean>(
            "ENABLE_ELASTICSEARCH_LOGGING",
            false
        );

        const loggerOptions = {
            level: environment === "development" ? "debug" : logLevel,
            format: format.combine(
                format.timestamp(),
                format.errors({ stack: true }),
                format.splat(),
                format.json()
            ),
            transports: [
                new transports.Console({
                    format:
                        environment === "development"
                            ? format.combine(format.colorize(), format.simple())
                            : format.json(),
                }),
            ] as TransportStream[],
        };

        if (enableElasticsearch) {
            try {
                const esTransportOpts = {
                    level: logLevel,
                    clientOpts: { node: elasticsearchNode },
                };
                const esTransport =
                    new ElasticsearchTransport.ElasticsearchTransport(
                        esTransportOpts
                    ) as TransportStream;
                loggerOptions.transports.push(esTransport);
            } catch (error) {
                console.error(
                    `Failed to configure Elasticsearch transport: ${error.message}`
                );
            }
        }

        return createLogger(loggerOptions);
    }

    /**
     * Ensures that the logger is initialized. If not, it creates a fallback logger.
     * @returns {WinstonLogger} The logger instance.
     */
    private ensureLogger(): WinstonLogger {
        if (!this.logger) {
            console.error(
                "Logger is not initialized yet. Using fallback logger."
            );
            return createLogger({
                level: "error",
                transports: [new transports.Console()],
            });
        }
        return this.logger;
    }

    /**
     * Logs a message with "info" level.
     * @param message - The message to log.
     */
    public log(message: string): void {
        this.ensureLogger().info(message);
    }

    /**
     * Logs an error message with "error" level and optional trace.
     * @param message - The error message to log.
     * @param trace - Optional stack trace for the error.
     */
    public error(message: string, trace?: string): void {
        this.ensureLogger().error(message, trace ? { trace } : undefined);
    }

    /**
     * Logs a warning message with "warn" level.
     * @param message - The message to log.
     */
    public warn(message: string): void {
        this.ensureLogger().warn(message);
    }

    /**
     * Logs a debug message with "debug" level.
     * @param message - The message to log.
     */
    public debug(message: string): void {
        this.ensureLogger().debug(message);
    }

    /**
     * Logs a verbose message with "verbose" level.
     * @param message - The message to log.
     */
    public verbose(message: string): void {
        this.ensureLogger().verbose(message);
    }
}
