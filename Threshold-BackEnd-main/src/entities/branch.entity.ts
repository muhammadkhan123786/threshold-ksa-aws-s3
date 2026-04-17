import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
} from "typeorm";
import { Athlete } from "./athlete.entity";
import { Coach } from "./coach.entity";
import { Team } from "./team.entity";
import { IsUUID } from "class-validator";
import { Academy } from "./academy.entity";
import { User } from "./user.entity";
import { Manager } from "./manager.entity";
import { SportProfile } from "./sportProfile.entity";
import { ClubAdmin } from "./clubAdmin.entity";

@Entity()
export class Branch {
    @PrimaryGeneratedColumn("uuid")
    @IsUUID()
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(() => Athlete, (athlete) => athlete.branch)
    athletes: Athlete[];

    @OneToMany(() => Coach, (coach) => coach.branch)
    coaches: Coach[];

    @OneToMany(() => Team, (team) => team.branch)
    teams: Team[];

    @OneToMany(() => User, (user) => user.branch)
    users: User[];

    @ManyToOne(() => Academy, (academy) => academy.branches, {
        onDelete: "CASCADE",
    })
    academy: Academy;

    @ManyToOne(() => Manager, (manager) => manager.branch)
    managers: Manager[];

    @OneToMany(() => Manager, (manager) => manager.branch)
    sportProfiles: SportProfile[];

    @OneToMany(() => ClubAdmin, (clubAdmin) => clubAdmin.branch, {
        cascade: true,
    })
    clubAdmins: ClubAdmin[];
}
