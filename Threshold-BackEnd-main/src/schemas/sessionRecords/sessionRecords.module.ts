import { AthletesModule } from "../athletes/athletes.module";
import { SessionsModule } from "../sessions/sessions.module";
import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { SessionRecordsService } from "./sessionRecords.service";
import { SessionRecordsController } from "./sessionRecords.controller";
import { SessionRecord } from "../../entities/sessionRecord.entity";

@Module({
    imports: [
        AthletesModule,
        forwardRef(() => SessionsModule),
        TypeOrmModule.forFeature([SessionRecord]),
    ],
    controllers: [SessionRecordsController],
    providers: [SessionRecordsService],
    exports: [SessionRecordsService],
})
export class SessionRecordsModule {}
