import { AthleteLevel } from 'libs/enums/athlete';
import { Athlete, Payload } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { athleteAPIs } from 'services/apis';
import { selectAcademy } from 'store';
import { setCurrentAthlete } from 'store/academySlice';

interface Props {
    dependents?: any[];
    id?: string;
    idType: 'academy' | 'athlete' | 'team';
    page?: number;
}

export function useGetAthletes<ReturnType>({
    dependents,
    id,
    idType,
    page = 0,
    firstName,
    subscriptionStatus, // Existing filter
    level, // New filter
}: Props & { subscriptionStatus?: 'active' | 'inactive' | 'pending' | 'expired' } & {
    firstName?: string;
    level?: AthleteLevel; // Add level filter here
}) {
    const [data, setData] = useState<Athlete | Athlete[] | null | any>(id ? null : []);
    const [refresh, setRefresh] = useState<boolean>(true);
    const { academy } = useSelector(selectAcademy);
    const dispatch = useDispatch<any>();
    const [isLoading, setLoading] = useState(true);

    const refreshData = () => {
        setRefresh((prev) => !prev);
    };

    useEffect(() => {
        const getData = async (id: string) => {
            if (idType === 'athlete')
                await dispatch(athleteAPIs.getAthleteById(id)({})).then(
                    ({ payload }: Payload<Athlete>) => {
                        if (payload && payload.data && payload.data.payload) {
                            setData(payload.data.payload);
                            dispatch(setCurrentAthlete({ currentAthlete: payload.data.payload }));
                        }
                        setLoading(false);
                    },
                );

            if (['academy', 'team'].includes(idType))
                await dispatch(
                    athleteAPIs.getAthletes({
                        page,
                        ...(idType === 'academy' ? { academyId: id } : {}),
                        ...(idType === 'team' ? { teamId: id } : {}),
                        subscriptionStatus,
                        firstName,
                        level, // Include the level filter here
                    })({}),
                ).then(({ payload }: Payload<Athlete[]>) => {
                    if (payload && payload.data && payload.data.data) setData(payload.data.data);
                    setLoading(false);
                });
        };

        id && getData(id);
        academy?.id && getData(academy.id || '');
    }, [...(dependents || []), academy, refresh, subscriptionStatus, level, firstName]); // Add level to the dependencies

    return { data, refreshData, isLoading } as {
        data: ReturnType;
        refreshData: () => void;
        isLoading: boolean;
    };
}
