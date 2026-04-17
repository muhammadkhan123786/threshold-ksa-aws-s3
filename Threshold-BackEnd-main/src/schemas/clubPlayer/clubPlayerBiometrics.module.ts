import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClubPlayerBiometric } from "src/entities/clubPlayerBiometric.entity";
import { ClubPlayerBiometricsController } from "./clubPlayerBiometrics.controller";
import { ClubPlayerBiometricsService } from "./clubPlayerBiometrics.service";
import { ClubPlayerModule } from "./clubPlayer.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([ClubPlayerBiometric]),
        ClubPlayerModule,
    ],
    controllers: [ClubPlayerBiometricsController],
    providers: [ClubPlayerBiometricsService],
    exports: [ClubPlayerBiometricsService],
})
export class ClubPlayerBiometricsModule {}
