import { AthleteBiometric, Payload } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { athleteAPIs } from 'services/apis';

interface Props {
    dependents?: any[];
    athleteId?: string;
}

export function useGetAthleteBio({ dependents, athleteId }: Props): AthleteBiometric[] {
    const [data, setData] = useState<AthleteBiometric[]>([]);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const getData = async (id: string) => {
            await dispatch(athleteAPIs.getAthleteBiometrics({ athleteId: id })({})).then(
                ({ payload }: Payload<AthleteBiometric[]>) => {
                    if (payload && payload.data && payload.data.payload)
                        setData(payload.data.payload);
                },
            );
        };

        athleteId && getData(athleteId);
    }, dependents || []);

    return data;
}
