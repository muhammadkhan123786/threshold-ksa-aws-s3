import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { academyAPIs } from 'services/apis';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useEffect, useId, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Feedback, Payload } from 'libs/types';

export const Feedbacks = () => {
    const { trans } = useLocales();
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const { academy, ...rest } = useSelector(selectAcademy);
    const dispatch = useDispatch<any>();
    const key = useId();

    useEffect(() => {
        dispatch(
            academyAPIs.getFeedbacks({
                academyId: academy?.id,
            })({}),
        ).then(({ payload }: Payload<Feedback[]>) => {
            if (payload && payload.data && payload.data.payload)
                setFeedbacks(payload.data.payload || []);
        });
    }, []);
    return (
        <Theme.Body>
            <h1 className="text-[30px] font-bold">{trans('home.feedbacks.title')}</h1>
            <div className="text-[20px]">{trans('home.feedbacks.caption')}</div>

            <div className="flex flex-col w-full gap-[30px]">
                {feedbacks &&
                    feedbacks.map(
                        ({ name, email, notes, academy: { name: academyName } }, index: number) => (
                            <div
                                key={key + index}
                                className="w-full bg-white p-[20px] rounded-lg border grid grid-rows-[auto_auto_auto_auto] grid-cols-[20%_auto] gap-y-[10px]"
                            >
                                <div className="font-bold">{trans('home.feedbacks.academy')}</div>
                                <div className="">{academyName}</div>

                                <div className="font-bold">
                                    {trans('home.feedbacks.contactName')}
                                </div>
                                <div className="">{name}</div>

                                <div className="font-bold">{trans('home.feedbacks.email')}</div>
                                <div className="">{email}</div>

                                <div className="col-span-2 mt-[30px]">{notes}</div>
                            </div>
                        ),
                    )}
            </div>
        </Theme.Body>
    );
};
