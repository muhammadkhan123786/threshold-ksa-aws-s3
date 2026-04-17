import { Payload, Team } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { teamAPIs } from 'services/apis';

interface Props {
    id: string;
    idType: 'academy' | 'team' | 'coach';
    dependents?: any[];
    page?: number;
}

export function useGetTeams<ReturnType>({ dependents, id, idType, page = 0 }: Props) {
    const [data, setData] = useState<Team | Team[] | null>(id ? null : []);
    const dispatch = useDispatch<any>();
    const [isLoading, setLoading] = useState(true);

    useEffect(
        () => {
            const getData = async (id: string) => {
                setLoading(true);

                if (idType === 'team')
                    await dispatch(teamAPIs.getTeamById(id)({})).then(
                        ({ payload }: Payload<Team>) => {
                            if (payload && payload.data && payload.data.payload) {
                                setData(payload.data.payload);
                            }

                            setLoading(false);
                        },
                    );

                if (['academy', 'coach'].includes(idType))
                    await dispatch(
                        teamAPIs.getTeams({
                            page,
                            ...(idType === 'academy' ? { academyId: id } : {}),
                            ...(idType === 'coach' ? { coachId: id } : {}),
                        })({}),
                    ).then(({ payload }: Payload<Team[]>) => {
                        if (payload && payload.data && payload.data.data)
                            setData(payload.data.data);

                        setLoading(false);
                    });
            };

            id && getData(id);
        },
        [...(dependents || []), id] || [],
    );

    return { data, isLoading } as { data: ReturnType; isLoading: boolean };
}
