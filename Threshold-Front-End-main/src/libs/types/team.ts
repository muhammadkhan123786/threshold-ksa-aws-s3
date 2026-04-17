import { SportProfileType } from 'libs/enums';
import { Athlete } from './athlete';
import { Coach } from './coach';

export type Team = {
    id: string;
    name: string;
    logo: string;
    branch: string;
    sport: SportProfileType;
    creationDate: string;
    coach?: Coach;
    athletes?: Athlete[];
};
