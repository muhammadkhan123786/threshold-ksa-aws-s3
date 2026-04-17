export interface PublicLink {
    id: string;
    academy: {
        id: string;
        name: string;
    };
    expirationDate: string;
    limitNumber: number;
    createdBy: {
        id: string;
        name: string;
    };
    isActive: boolean;
}
