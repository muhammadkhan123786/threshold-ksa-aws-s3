import { Payload, Coach } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { coachAPIs } from 'services/apis';
import { selectAcademy } from 'store';

interface Props {
    dependents?: any[];
    id?: string;
    idType: 'academy' | 'coach';
    page?: number;
}

export function useGetCoaches<ReturnType>({ dependents, id, idType, page = 0 }: Props) {
    const [data, setData] = useState<Coach | Coach[] | null>(id ? null : []);
    const { academy } = useSelector(selectAcademy);
    const dispatch = useDispatch<any>();
    const [isLoading, setLoading] = useState(true);
    useEffect(
        () => {
            const getData = async (id: string) => {
                setLoading(true);
                if (idType === 'coach')
                    await dispatch(coachAPIs.getCoachById(id)({})).then(
                        ({ payload }: Payload<Coach>) => {
                            if (payload && payload.data && payload.data.payload) {
                                setData(payload.data.payload);
                            }
                            setLoading(false);
                        },
                    );

                if (idType === 'academy')
                    await dispatch(coachAPIs.getCoaches({ academyId: academy.id, page })({})).then(
                        ({ payload }: Payload<Coach[]>) => {
                            if (payload && payload.data && payload.data.data)
                                setData(payload.data.data);

                            setLoading(false);
                        },
                    );
            };

            idType === 'coach' && id && getData(id);
            idType === 'academy' && academy?.id && getData(academy.id);
        },
        [...(dependents || []), academy] || [],
    );

    return { data, isLoading } as { data: ReturnType; isLoading: boolean };
}
