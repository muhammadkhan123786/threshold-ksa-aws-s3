import { Module, forwardRef } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UsersService } from "./users.service";
import { UsersController } from "./users.controller";
import { User } from "src/entities/user.entity";
import { AcademiesModule } from "../academies/academies.module";
import { ApprovalLog } from "src/entities/ApprovalLog.entity";
import { CoachesModule } from "../coaches/coaches.module";
import { Coach } from "src/entities/coach.entity";
import { MailerModule } from "src/mailer/mailer.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Coach, ApprovalLog]),
        forwardRef(() => AcademiesModule),
        forwardRef(() => CoachesModule),
        MailerModule,
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
