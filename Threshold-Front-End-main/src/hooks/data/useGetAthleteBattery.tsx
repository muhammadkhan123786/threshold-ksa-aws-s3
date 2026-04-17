import { AthleteFitnessBattery, Payload } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { athleteAPIs } from 'services/apis';

interface Props {
    dependents?: any[];
    athleteId?: string;
}

export function useGetAthleteBattery({ dependents, athleteId }: Props): AthleteFitnessBattery[] {
    const [data, setData] = useState<AthleteFitnessBattery[]>([]);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const getData = async (id: string) => {
            await dispatch(athleteAPIs.getAthleteBatteries({ athleteId: id })({})).then(
                ({ payload }: Payload<AthleteFitnessBattery[]>) => {
                    if (payload && payload.data && payload.data.payload)
                        setData(payload.data.payload);
                },
            );
        };

        athleteId && getData(athleteId);
    }, dependents || []);

    return data;
}
