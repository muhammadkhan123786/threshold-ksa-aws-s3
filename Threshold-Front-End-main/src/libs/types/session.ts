import { SessionRecordStatus, PlayingSessionStatus } from 'libs/enums';
import { Athlete } from './athlete';
import { Team } from './team';

export type SessionPlayingType = {
    id: string;
    createdAt: string;
    updatedAt: string;
    date: string;
    type: string;
    status: PlayingSessionStatus;
    dayPeriod: string;
    from: string;
    to: string;
    team?: Team;
    achievedSession?: string;
    space?: string;
    description?: string;
    title?: string;
    sessionRecords?: SessionRecord[];
    weeklySession?: {
        id: string;
        createdAt: string;
        updatedAt: string;
        title: string;
        description: string;
        weekTarget: number;
        weekDate: string;
    };
};

export type SessionRecord = {
    id: string;
    createdAt: string;
    updatedAt: string;
    comment: string;
    status: SessionRecordStatus;
    scale?: string;
    athlete?: Athlete;
    session?: SessionPlayingType;
};
