import { Payload, SessionPlayingType, Team } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sessionAPIs } from 'services/apis';

interface Props {
    id: string;
    idType: 'session' | 'academy' | 'team' | 'coach';
    dependents?: any[];
    page?: number;
}

export function useGetSessions<ReturnType>({ dependents, id, idType, page = 0 }: Props) {
    const [data, setData] = useState<SessionPlayingType | SessionPlayingType[] | null>(
        id ? null : [],
    );
    const dispatch = useDispatch<any>();

    useEffect(
        () => {
            const getData = async (id: string) => {
                if (idType === 'session')
                    await dispatch(sessionAPIs.getSessionById(id)({})).then(
                        ({ payload }: Payload<SessionPlayingType>) => {
                            if (payload && payload.data && payload.data.payload) {
                                setData(payload.data.payload);
                            }
                        },
                    );

                if (['academy', 'coach', 'team'].includes(idType))
                    await dispatch(
                        sessionAPIs.getSessions({
                            page,
                            ...(idType === 'academy' ? { academyId: id } : {}),
                            ...(idType === 'team' ? { teamId: id } : {}),
                            ...(idType === 'coach' ? { coachId: id } : {}),
                        })({}),
                    ).then(({ payload }: Payload<SessionPlayingType[]>) => {
                        if (payload && payload.data && payload.data.data)
                            setData(payload.data.data);
                    });
            };

            id && getData(id);
        },
        [...(dependents || []), id] || [],
    );

    return data as ReturnType;
}
