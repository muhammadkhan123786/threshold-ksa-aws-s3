import { Athlete } from './athlete';
import { Coach } from './coach';
import { Team } from './team';

export interface Branch {
    id: string;
    name: string;
    description?: string;
    avatar: string;
    createdAt: Date;
    updatedAt: Date;
    athletes: Athlete[];
    coaches: Coach[];
    teams: Team[];
}
