import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";
import { IsUUID } from "class-validator";
import { ClubSession } from "./clubSession.entity";
import { sportClubProfiles } from "./sportClubProfiles.entity";

@Entity("club_session_template")
export class ClubSessionTemplate {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column()
    name: string;

    @Column("text", { nullable: true })
    description: string;

    @Column()
    sportProfileId: string;

    @ManyToOne(() => sportClubProfiles, (profile) => profile.sessionTemplates)
    sportProfile: sportClubProfiles;

    @Column("jsonb")
    phases: {
        id: string;
        name: string;
        description: string;
        order: number;
        unit: string;
        target: number;
        techniques: {
            name: string;
            description: string;
            defaultValue?: number;
            value: string;
            unit: string;
        }[];
    }[];

    @OneToMany(() => ClubSession, (session) => session.template)
    sessions: ClubSession[];

    @CreateDateColumn({ type: "timestamp" })
    createdAt: Date;

    @UpdateDateColumn({ type: "timestamp" })
    updatedAt: Date;
}
