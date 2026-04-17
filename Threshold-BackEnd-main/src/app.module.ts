import { SportProfilesModule } from "./schemas/sportProfiles/sportProfiles.module";
import { FeedbacksModule } from "./schemas/feedbacks/feedbacks.module";
import { SessionRecordsModule } from "./schemas/sessionRecords/sessionRecords.module";
import { SessionsModule } from "./schemas/sessions/sessions.module";
import { TeamsModule } from "./schemas/teams/teams.module";
import { CoachesModule } from "./schemas/coaches/coaches.module";
import { AthleteProfilesModule } from "./schemas/athleteProfiles/athleteProfiles.module";
import { AthleteBatteriesModule } from "./schemas/athleteBatteries/athleteBatteries.module";
import { AthleteBiometricsModule } from "./schemas/athleteBiometrics/athleteBiometrics.module";
import { AthletesModule } from "./schemas/athletes/athletes.module";
import { AcademiesModule } from "./schemas/academies/academies.module";
import { UsersModule } from "./schemas/users/users.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import entities from "./entities/entities";
import { AuthModule } from "./auth/auth.module";
import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod,
} from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AthleteSubscriptionModule } from "./schemas/AthleteSubscription/athleteSubscription.module";
import { TimeZoneService } from "./timezone/timezone.service";
import { I18nModule } from "./i18n/i18n.module";
import { PublicModule } from "./schemas/public/public.module";
import { LinksModule } from "./schemas/links/links.module";
import { TasksModule } from "./tasks/tasks.module";
import { FirebaseModule } from "./firebase/firebase.module";
import { BranchModule } from "./branch/branch.module";
import { S3Module } from "./s3/s3.module";
import { AthleteDocumentsModule } from "./athleteDocuments/athleteDocuments.module";
import { AthleteHealthModule } from "./athleteHealth/athleteHealth.module";
import { AthleteRecordModule } from "./athleteRecord/athleteRecord.module";
import { LoggerService } from "./logger/logger.service";
import { TerminusModule } from "@nestjs/terminus";
import { WeeklySessionModule } from "./schemas/weeklySession/weeklySession.module";
import { examSessionsModule } from "./schemas/exams/examSessions.module";
import { ClubModule } from "./schemas/club/club.module";
import { SportClubProfilesModule } from "./schemas/sportClubProfiles/SportClubProfiles.module";
import { StockModule } from "./schemas/stock/stock.module";
import { SportCategorySeederModule } from "./seeder/stock/sport-category-seeder.module";
import { ClubManagerModule } from "./schemas/clubManager/clubManager.module";
import { CurlLoggerMiddleware } from "./middlewares/curl-logger.middleware";
import { HttpModule } from "@nestjs/axios";
import { ClubPlayerModule } from "./schemas/clubPlayer/clubPlayer.module";
import { ClubCoachesModule } from "./schemas/clubCoaches/clubCoaches.module";
import { ClubTeamsModule } from "./schemas/clubTeams/clubTeams.module";
import { ClubAdminModule } from "./schemas/clubAdmin/clubAdmin.module";
import { PlayerDocumentsModule } from "./playerDocuments/playerDocuments.module";
import { ClubSessionModule } from './modules/club-session/club-session.module';
import { ClubSessionTemplateModule } from './modules/club-session/club-session-template.module';
import { WorkHistoryModule } from "./schemas/workHistory/workHistory.module";
import { ContractAuditModule } from "./schemas/contractAudit/contractAudit.module";

@Module({
    imports: [
        // ===== configs =====
        // --- database ---
        ConfigModule.forRoot({ isGlobal: true }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => {
                const isProduction =
                    configService.get<string>("NODE_ENV") === "production";
                return {
                    type: "postgres",
                    host: configService.get("DATABASE_HOST"),
                    port: +configService.get<number>("DATABASE_PORT"),
                    username: configService.get("POSTGRES_USER"),
                    password: configService.get("POSTGRES_PASSWORD"),
                    database: configService.get("POSTGRES_DB"),
                    entities: entities,
                    synchronize: !isProduction,
                    ssl: false,
                };
            },
            inject: [ConfigService],
        }),
        // ===== tables =====
        TerminusModule,
        PlayerDocumentsModule,
        ClubAdminModule,
        I18nModule,
        HttpModule,
        AthleteHealthModule,
        AthleteRecordModule,
        S3Module,
        AthleteDocumentsModule,
        BranchModule,
        SportProfilesModule,
        FeedbacksModule,
        SessionRecordsModule,
        SessionsModule,
        TeamsModule,
        WeeklySessionModule,
        examSessionsModule,
        CoachesModule,
        AthleteProfilesModule,
        AthleteBatteriesModule,
        AthleteBiometricsModule,
        AthletesModule,
        AthleteSubscriptionModule,
        AcademiesModule,
        UsersModule,
        AuthModule,
        PublicModule,
        LinksModule,
        TasksModule,
        FirebaseModule,
        SportClubProfilesModule,
        ClubModule,
        StockModule,
        SportCategorySeederModule,
        ClubManagerModule,
        ClubPlayerModule,
        ClubCoachesModule,
        ClubTeamsModule,
        ClubSessionModule,
        ClubSessionTemplateModule,
        WorkHistoryModule,
        ContractAuditModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        TimeZoneService,
        LoggerService,
        {
            provide: "TIME_ZONE_INITIALIZER",
            useFactory: (timeZoneService: TimeZoneService) => () =>
                timeZoneService.initialize(),
            inject: [TimeZoneService],
        },
    ],
    exports: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CurlLoggerMiddleware).forRoutes("*");
    }
}
