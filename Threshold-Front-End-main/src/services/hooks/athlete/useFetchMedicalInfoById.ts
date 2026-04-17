import api from '../../clients/wretchClient';
import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
export enum Consideration {
    NONE = 'none',
    ATTENTION = 'attention',
    AUTISTIC = 'autistic',
    DOWN = 'down',
    VISUAL = 'visual',
    DEAF = 'deaf',
    PHYSICAL = 'physical',
    ANXIETY = 'anxiety',
    INTELLECTUAL = 'intellectual',
}
export enum YesNo {
    YES = 'yes',
    NO = 'no',
}
interface MedicalInfo {
    updatedAt: string | undefined;
    allergies: string;
    chronicDisease: string;
    foodAllergies: string;
    foodAllergiesUrl: string;
    currentConsideration: string;
    considerationUrl: string;
    chronic: string[] | any;
    consideration: Consideration;
    dateOfUpdating: any;
    injury: YesNo;
    foodAllergiesFile: any;
    currentConsiderationFile: any;
}

interface MedicalInfoResponse {
    message: string;
    medicalInfo: MedicalInfo;
}

const fetchMedicalInfoById = async (athleteId: string): Promise<MedicalInfoResponse> => {
    const response = await api
        .url(`athletes/${athleteId}/health/medical-info`)
        .get()
        .json<MedicalInfoResponse>();
    return response;
};

export const useFetchMedicalInfoById = (
    athleteId: string,
    options?: UseQueryOptions<MedicalInfoResponse, Error>,
): UseQueryResult<MedicalInfoResponse, Error> => {
    return useQuery<MedicalInfoResponse, Error>({
        queryKey: ['medicalInfo', athleteId],
        queryFn: () => fetchMedicalInfoById(athleteId),
        ...options,
    });
};
