import { Between, EntityManager, UpdateResult } from "typeorm";
import { Athlete } from "../../entities/athlete.entity";
import { AthleteSubscription } from "../../entities/athleteSubscription.entity";
import { CreateAthleteDto } from "src/dto/athletes/create-athlete.dto";
import { UpdateAthleteDto } from "src/dto/athletes/update-athlete.dto";
import { SubscriptionStatus } from "src/enums/subscription-status.enum";
import { SessionRecord } from "src/entities/sessionRecord.entity";
import {
    PlayingSessionStatus,
    SessionRecordStatus,
} from "src/enums/athletes.enum";
import moment from "moment";

export class AthleteUtil {
    static async updateAthleteData(
        id: string,
        updateAthleteDto: UpdateAthleteDto,
        transactionalEntityManager: EntityManager,
        academiesService: any
    ): Promise<UpdateResult> {
        const {
            academy: academyId,
            periodOfSubscription,
            paymentMethod,
            cashValue,
            remainingValue,
            ...rest
        } = updateAthleteDto;
        const athleteObj = { ...rest } as any;

        if (academyId) {
            const academyResponse =
                await academiesService.getAcademyById(academyId);
            if (
                !academyResponse ||
                academyResponse.status !== 200 ||
                !academyResponse.payload
            ) {
                throw new Error("Academy doesn't exist");
            }
            athleteObj["academy"] = academyResponse.payload;
        }

        const updateResult = await transactionalEntityManager.update(
            Athlete,
            { id },
            athleteObj
        );

        if (
            periodOfSubscription ||
            paymentMethod ||
            cashValue ||
            remainingValue
        ) {
            let subscription = await transactionalEntityManager.findOne(
                AthleteSubscription,
                { where: { athlete: { id } } }
            );

            if (!subscription) {
                subscription = transactionalEntityManager.create(
                    AthleteSubscription,
                    {
                        athlete: { id },
                        period: periodOfSubscription,
                        status: SubscriptionStatus.ACTIVE,
                        paymentMethod,
                        cashValue,
                        remainingValue,
                    }
                );
            } else {
                if (periodOfSubscription)
                    subscription.period = periodOfSubscription;
                if (paymentMethod) subscription.paymentMethod = paymentMethod;
                if (cashValue) subscription.cashValue = cashValue;
                if (remainingValue)
                    subscription.remainingValue = remainingValue;
            }

            await transactionalEntityManager.save(
                AthleteSubscription,
                subscription
            );
        }

        return updateResult;
    }

    static async checkAthleteNIN(
        dto: CreateAthleteDto | UpdateAthleteDto,
        transactionalEntityManager: EntityManager,
        isUpdate: boolean = false,
        currentAthleteId?: string
    ): Promise<void> {
        const query = transactionalEntityManager
            .createQueryBuilder(Athlete, "athlete")
            .where("athlete.nin = :nin", { nin: dto.nin })
            .andWhere("athlete.academyId = :academyId", {
                academyId: dto.academy,
            });

        if (isUpdate && currentAthleteId) {
            query.andWhere("athlete.id != :currentAthleteId", {
                currentAthleteId,
            });
        }

        const existingAthlete = await query.getOne();

        if (existingAthlete) {
            throw new Error(
                "Athlete with same NIN already exists in this academy"
            );
        }
    }

    static calculateDuration(session: any): number {
        const fromTime = moment(session.from, "hh:mm A");
        const toTime = moment(session.to, "hh:mm A");

        if (toTime.isBefore(fromTime)) {
            toTime.add(1, "day");
        }

        return toTime.diff(fromTime, "minutes");
    }

    static async getAthleteAnalytics(
        athleteId: string,
        entityManager: EntityManager,
        startDate: string,
        endDate: string
    ): Promise<any> {
        const sessions = await entityManager.find(SessionRecord, {
            where: { athlete: { id: athleteId } },
            relations: ["session"],
        });

        const trainingLoadSessions = await entityManager.find(SessionRecord, {
            where: {
                athlete: { id: athleteId },
                session: {
                    date: Between(
                        new Date(startDate).toISOString(),
                        new Date(endDate).toISOString()
                    ),
                },
            },
            relations: ["session"],
        });

        const totalSessions = sessions.length;
        const averageSessions = this.calculateAverageSessions(sessions);
        const practicingPercentage =
            this.calculatePracticingPercentage(sessions);
        const presencePercentage = this.calculatePresencePercentage(sessions);
        const trainingLoad = this.calculateTrainingLoad(trainingLoadSessions);
        const analyticsBreakdown = this.calculateAnalyticsBreakdown(sessions);

        const athleteProfile = await entityManager.findOne(Athlete, {
            where: { id: athleteId },
        });

        return {
            sessions: {
                totalSessions,
                averageSessions,
            },
            practicingPercentage,
            presencePercentage,
            level: athleteProfile?.level || "Unknown",
            trainingLoad,
            analyticsBreakdown,
        };
    }

    private static calculateAverageSessions(sessions: SessionRecord[]): number {
        const totalSessions = sessions.length;
        const uniqueMonths = new Set(
            sessions.map((session) => {
                const date = new Date(session.session.date);
                return `${date.getFullYear()}-${date.getMonth() + 1}`;
            })
        );

        return Math.round(totalSessions / uniqueMonths.size);
    }
    private static calculatePracticingPercentage(
        sessions: SessionRecord[]
    ): number {
        const doneSessions = sessions.filter(
            (session) => session.session.status === PlayingSessionStatus.DONE
        );
        const presentDoneSessions = doneSessions.filter(
            (session) => session.status === SessionRecordStatus.PRESENT
        ).length;
        const percentage =
            doneSessions.length === 0
                ? 0
                : Math.round((presentDoneSessions / doneSessions.length) * 100);

        return percentage;
    }

    private static calculatePresencePercentage(
        sessions: SessionRecord[]
    ): number {
        const presentSessions = sessions.filter(
            (session) => session.status === SessionRecordStatus.PRESENT
        ).length;
        return Math.round((presentSessions / sessions.length) * 100);
    }
    private static calculateTrainingLoad(sessions: SessionRecord[]): any[] {
        const loadByWeek = sessions.reduce((acc, session) => {
            const weekStart = this.getWeekStart(session.session.date);
            const duration = this.calculateDuration(session.session);
            const intensity = session.scale || 1;
            const load = duration * intensity;

            if (!acc[weekStart]) {
                acc[weekStart] = {
                    load: 0,
                    scaleTotal: 0,
                    sessionCount: 0,
                    sessions: [],
                };
            }

            acc[weekStart].load += load;
            acc[weekStart].scaleTotal += session.scale || 0;
            acc[weekStart].sessionCount += 1;
            acc[weekStart].sessions.push({
                date: session.session.date,
                scale: session.scale,
                comment: session.comment || "",
                load,
            });

            return acc;
        }, {});

        return Object.keys(loadByWeek).map((weekStart) => {
            const weekData = loadByWeek[weekStart];
            const averageScale =
                weekData.scaleTotal / weekData.sessionCount || 0;

            return {
                week: weekStart,
                load: weekData.load,
                averageScale: averageScale,
                sessions: weekData.sessions,
            };
        });
    }

    private static getWeekStart(date: string): string {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const weekStart = new Date(d.setDate(diff));
        return weekStart.toLocaleDateString("default", {
            month: "short",
            day: "numeric",
        });
    }

    private static calculateAnalyticsBreakdown(sessions: SessionRecord[]): any {
        const breakdown = {
            present: 0,
            absent: 0,
            injury: 0,
            playingWithNationalTeam: 0,
        };

        sessions.forEach((session) => {
            switch (session.status) {
                case SessionRecordStatus.PRESENT:
                    breakdown.present++;
                    break;
                case SessionRecordStatus.ABSENT:
                    breakdown.absent++;
                    break;
                case SessionRecordStatus.INJURY:
                    breakdown.injury++;
                    break;
                case SessionRecordStatus.PLAYING_WITH_NATIONAL_TEAM:
                    breakdown.playingWithNationalTeam++;
                    break;
            }
        });

        return breakdown;
    }
}
