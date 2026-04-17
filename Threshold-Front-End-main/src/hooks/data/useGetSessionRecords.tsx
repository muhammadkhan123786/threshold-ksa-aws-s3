import { SessionRecordStatus } from 'libs/enums';
import { Payload, SessionRecord } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { sessionRecordAPIs } from 'services/apis';

interface Props {
    id: string;
    idType: 'sessionRecord' | 'academy' | 'session';
    dependents?: any[];
    page?: number;
    status?: string;
}

export function useGetSessionRecords<ReturnType>({
    dependents,
    status,
    id,
    idType,
    page = 0,
}: Props) {
    const [data, setData] = useState<SessionRecord | SessionRecord[] | null>(id ? null : []);
    const dispatch = useDispatch<any>();

    useEffect(
        () => {
            const getData = async (id: string) => {
                if (idType === 'sessionRecord')
                    await dispatch(sessionRecordAPIs.getSessionRecordById(id)({})).then(
                        ({ payload }: Payload<SessionRecord>) => {
                            if (payload && payload.data && payload.data.payload) {
                                setData(payload.data.payload);
                            }
                        },
                    );

                if (['academy', 'session'].includes(idType))
                    await dispatch(
                        sessionRecordAPIs.getSessionRecords({
                            page,
                            status,
                            ...(idType === 'academy' ? { academyId: id } : {}),
                            ...(idType === 'session' ? { sessionId: id } : {}),
                        })({}),
                    ).then(({ payload }: Payload<SessionRecord[]>) => {
                        if (payload && payload.data && payload.data.payload)
                            setData(payload.data.payload);
                    });
            };

            id && getData(id);
        },
        [...(dependents || []), id] || [],
    );

    return data as ReturnType;
}
