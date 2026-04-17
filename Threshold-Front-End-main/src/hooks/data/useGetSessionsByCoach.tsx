import { SessionPlayingType } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { coachAPIs } from 'services/apis';

interface Props {
    dependents?: any[];
    date?: Date;
}

export function useGetSessionsByCoach({ dependents = [], date }: Props): {
    data: SessionPlayingType[] | null;
    isLoading: boolean;
} {
    const [data, setData] = useState<SessionPlayingType[] | null>(null);
    const dispatch = useDispatch<any>();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            setLoading(true);
            try {
                const query = { date: date?.toISOString() };
                const result = await dispatch(coachAPIs.getSessionsByCoach(query)({}));
                if (result.payload && result.payload.data) {
                    setData(result.payload.data.payload);
                }
            } catch (error) {
                console.error('Failed to fetch sessions by coach:', error);
            } finally {
                setLoading(false);
            }
        };

        if (date) {
            getData();
        }
    }, [...dependents]);

    return { data, isLoading };
}
