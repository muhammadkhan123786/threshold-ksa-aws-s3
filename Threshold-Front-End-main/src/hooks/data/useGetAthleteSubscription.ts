import { AthleteSubscription } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { athleteAPIs } from 'services/apis';

interface Props {
    dependents?: any[];
    athleteId?: string;
}

export function useGetAthleteSubscription({
    dependents = [],
    athleteId,
}: Props): AthleteSubscription | null {
    const [data, setData] = useState<AthleteSubscription | null>(null);
    const dispatch = useDispatch<any>();

    useEffect(() => {
        const getData = async (id: string) => {
            const result = await dispatch(athleteAPIs.getAthleteSubscription(id)({}));
            if (result.payload && result.payload.data) {
                setData(result.payload.data.payload);
            }
        };

        if (athleteId) {
            getData(athleteId);
        }
    }, [athleteId, ...dependents]);

    return data;
}
