import { Academy } from './academy';

export type Feedback = {
    id: string;
    name: string;
    email: string;
    notes: string;
    academy: Academy;
};
