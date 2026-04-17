import { Feedback, Payload } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { academyAPIs } from 'services/apis';

interface Props {
    id: string;
    idType: 'academy' | 'feedback';
    dependents?: any[];
    page?: number;
}

export function useGetFeedbacks<ReturnType>({ dependents, id, idType, page = 0 }: Props) {
    const [data, setData] = useState<Feedback | Feedback[] | null>(id ? null : []);
    const dispatch = useDispatch<any>();

    useEffect(
        () => {
            const getData = async (id: string) => {
                if (idType === 'feedback')
                    await dispatch(academyAPIs.getFeedbackById(id)({})).then(
                        ({ payload }: Payload<Feedback>) => {
                            if (payload && payload.data && payload.data.payload) {
                                setData(payload.data.payload);
                            }
                        },
                    );

                if (['academy'].includes(idType))
                    await dispatch(
                        academyAPIs.getFeedbacks({
                            page,
                            ...(idType === 'academy' ? { academyId: id } : {}),
                        })({}),
                    ).then(({ payload }: Payload<Feedback[]>) => {
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
