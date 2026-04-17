import { Payload, User } from 'libs/types';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAPIs } from 'services/apis';

interface Props {
    id: string;
    idType: 'user' | 'academy';
    dependents?: any[];
    page?: number;
}

export function useGetUsers<ReturnType>({ dependents, id, idType }: Props) {
    const [data, setData] = useState<User | User[] | null>(id ? null : []);
    const dispatch = useDispatch<any>();
    const [isLoading, setLoading] = useState(true);
    useEffect(
        () => {
            const getData = async (id: string) => {
                setLoading(true);
                if (idType === 'user')
                    await dispatch(authAPIs.getUserById(id)({})).then(
                        ({ payload }: Payload<User>) => {
                            if (payload && payload.data && payload.data.payload) {
                                setData(payload.data.payload);
                            }

                            setLoading(false);
                        },
                    );

                // if (['academy'].includes(idType))
                //     await dispatch(
                //         authAPIs.getUsers({
                //             page,
                //             ...(idType === 'academy' ? { academyId: id } : {}),
                //         })({}),
                //     ).then(({ payload }: Payload<User[]>) => {
                //         if (payload && payload.data && payload.data.payload)
                //             setData(payload.data.payload);
                //     });
            };

            id && getData(id);
        },
        [...(dependents || []), id] || [],
    );

    return { data, isLoading } as { data: ReturnType; isLoading: boolean };
}
