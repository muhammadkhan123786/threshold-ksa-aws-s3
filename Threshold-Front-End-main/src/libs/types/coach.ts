import { Gender, SportProfileType } from 'libs/enums';
import { Team } from './team';
import { ContractDetails } from './contractDetails';
import { CoachType } from 'libs/enums/coach-type';

export type Coach = {
    id: string;
    avatar: string;
    experience: number;
    birthday: string;
    phone: string;
    gender: Gender;
    lastName: string;
    firstName: string;
    joinDate: string;
    type: CoachType;
    sport: SportProfileType;
    user: {
        username: string;
        email: string;
    };
    teams?: Team[];
    contractDetails?: ContractDetails;
};
