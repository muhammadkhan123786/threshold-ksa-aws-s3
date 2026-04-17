export interface Session {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    location: {
        name: string;
        distance: number;
    };
    ageGroup: string;
    gender: 'male' | 'female';
    participants: {
        role: string;
        count: number;
    }[];
    totalParticipants: number;
}
