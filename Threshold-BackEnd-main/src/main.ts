import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as bodyParser from "body-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { QueryFailedExceptionFilter } from "./common/query-failed-exception.filter";
import { LoggerService } from "./logger/logger.service";
import { runSeeders } from "./seeder/runSeeders";

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    
    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

    const loggerService = app.get(LoggerService);
    app.useLogger(loggerService);

    app.useGlobalFilters(new QueryFailedExceptionFilter());

    app.useStaticAssets(join(__dirname, "..", "public"), {
        prefix: "/public/",
    });
    app.setBaseViewsDir(join(__dirname, "..", "views"));
    app.setViewEngine("hbs");

    const config = new DocumentBuilder()
        .setTitle("Threshold DB")
        .setDescription("The API of the Threshold DB website")
        .setVersion("1.0")
        .addBearerAuth()
        .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup("api", app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            requestInterceptor: (req) => {
                const storedData = localStorage.getItem("authorized");

                if (storedData) {
                    try {
                        const parsedData = JSON.parse(storedData);
                        const token = parsedData?.bearer?.value;
                        if (token) {
                            req.headers["Authorization"] = `Bearer ${token}`;
                        }
                    } catch (error) {
                        console.error("Error parsing stored JWT token", error);
                    }
                }

                return req;
            },
        },
    });

    app.use(helmet());
    app.use(
        rateLimit({
            windowMs: 15 * 60 * 1000,
            max: 1000,
        })
    );

    // enable CORS
    app.enableCors({
        origin: process.env.FRONTEND_URLS?.split(","),
        credentials: true,
    });

    await runSeeders(app);
    await app.listen(process.env.PORT);
}

bootstrap();
