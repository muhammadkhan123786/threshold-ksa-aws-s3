import { Controller, Get } from "@nestjs/common";
import {
    HealthCheckService,
    HealthCheck,
    HttpHealthIndicator,
    TypeOrmHealthIndicator,
    DiskHealthIndicator,
    MemoryHealthIndicator,
} from "@nestjs/terminus";
import { LoggerService } from "./logger/logger.service";

@Controller()
export class AppController {
    constructor(
        private readonly health: HealthCheckService,
        private readonly http: HttpHealthIndicator,
        private readonly db: TypeOrmHealthIndicator,
        private readonly disk: DiskHealthIndicator,
        private readonly memory: MemoryHealthIndicator,
        private readonly logger: LoggerService
    ) {}

    @Get("health")
    @HealthCheck()
    async checkHealth() {
        try {
            this.logger.log("Performing health check");

            const healthStatus = await this.health.check([
                async () =>
                    this.http.pingCheck(
                        "nestjs-docs",
                        "https://docs.nestjs.com"
                    ),
                async () => this.db.pingCheck("database", { timeout: 1500 }),
                async () =>
                    this.disk.checkStorage("disk", {
                        path: "/",
                        thresholdPercent: 0.9,
                    }),
                async () =>
                    this.memory.checkHeap("memory_heap", 200 * 1024 * 1024),
                async () =>
                    this.memory.checkRSS("memory_rss", 300 * 1024 * 1024),
            ]);

            this.logger.log("Health check successful");
            return healthStatus;
        } catch (error) {
            this.logger.error(
                "Health check failed",
                error.stack || error.message
            );
            throw error;
        }
    }
}
