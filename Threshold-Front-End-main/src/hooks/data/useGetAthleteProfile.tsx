import { Payload } from 'libs/types';
import { AthleteProfile } from 'libs/types/athlete';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { athleteAPIs } from 'services/apis';

interface Props {
    dependents?: any[];
    athleteId?: string;
}

export function useGetAthleteProfiles({ dependents, athleteId }: Props): AthleteProfile[] {
    const [data, setData] = useState<AthleteProfile[]>([]);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const getData = async (id: string) => {
            await dispatch(athleteAPIs.getAthleteProfiles({ athleteId: id })({})).then(
                ({ payload }: Payload<AthleteProfile[]>) => {
                    if (payload && payload.data && payload.data.payload)
                        setData(payload.data.payload);
                },
            );
        };

        athleteId && getData(athleteId);
    }, dependents || []);

    return data;
}
