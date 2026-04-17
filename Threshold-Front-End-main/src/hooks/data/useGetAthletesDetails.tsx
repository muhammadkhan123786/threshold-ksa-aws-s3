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

export function useGetAthletesDetails<ReturnType>({ dependents, id, idType, page = 0 }: Props) {
    const [data, setData] = useState<Athlete | Athlete[] | null>(id ? null : []);
    const [refresh, setRefresh] = useState<boolean>(true);
    const { academy } = useSelector(selectAcademy);
    const dispatch = useDispatch<any>();
    const [isLoading, setLoading] = useState(true);

    const refreshData = () => {
        setRefresh((prev) => !prev);
    };

    useEffect(() => {
        const getData = async (id: string) => {
            setLoading(true);
            if (idType === 'athlete')
                await dispatch(athleteAPIs.getAthleteDetailsById(id)({})).then(
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
                    })({}),
                ).then(({ payload }: Payload<Athlete[]>) => {
                    if (payload && payload.data && payload.data.payload)
                        setData(payload.data.payload);

                    setLoading(false);
                });
        };

        id && getData(id);
        academy?.id && getData(academy.id || '');
    }, [...(dependents || []), academy, refresh]);

    return { data, refreshData, isLoading } as {
        data: ReturnType;
        refreshData: () => void;
        isLoading: boolean;
    };
}
