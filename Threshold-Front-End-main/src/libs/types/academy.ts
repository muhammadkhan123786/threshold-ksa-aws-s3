import { SportProfileType } from 'libs/enums';
import { Athlete } from './athlete';
import { Coach } from './coach';
import { Team } from './team';

export type SportProfile = {
    id: string;
    sport: SportProfileType;
    metadata: string[];
};

export type Academy = {
    id: string;
    contactNumber: string;
    registrationNumber: string;
    name: string;
    isMultiBranch: boolean;
    athletes: Athlete[];
    coaches: Coach[];
    teams: Team[];
    sportProfiles: SportProfile[];
};
