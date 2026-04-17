import { Session } from "src/entities/session.entity";
import { SelectQueryBuilder } from "typeorm";

export class CoachUtil {
    static groupSessionsByTeam(sessions: Session[]): any {
        const grouped = sessions.reduce((acc, session) => {
            const teamId = session.team.id;
            if (!acc[teamId]) {
                acc[teamId] = {
                    ...session.team,
                    sessions: [],
                };
            }
            acc[teamId].sessions.push(session);
            return acc;
        }, {});

        return Object.values(grouped);
    }
    static applyDateFilter(
        qb: SelectQueryBuilder<any>,
        dateString: string
    ): SelectQueryBuilder<any> {
        const date = new Date(dateString);
        const month = date.getUTCMonth() + 1;
        const day = date.getUTCDate();

        qb.andWhere("EXTRACT(MONTH FROM session.date::timestamp) = :month", {
            month,
        }).andWhere("EXTRACT(DAY FROM session.date::timestamp) = :day", {
            day,
        });

        return qb;
    }
}
