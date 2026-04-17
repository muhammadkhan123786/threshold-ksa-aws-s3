import React from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { arrayToSelectOptions } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { MultiSelectController } from 'components/multi-selection';
import { PlayingSessionType } from 'libs/enums';
import { useAddSessionSchema } from 'schemas/team/addSession';
import { closeModal, setModalContent } from 'store/controlsSlice';
import { useCreateSessionUnderWeeklySession } from 'services/hooks/weeklySessions/useCreateSessionUnderWeeklySession';
import TimePicker from './TimePicker';
import { InputController } from 'components/input';
import { BoxContainer } from './Theme';

export const AddWeeklySession: React.FC<
    FormWindowProps & FormControlsProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { defaultValues } = props;
    const { academy } = useSelector(selectAcademy);

    const addSessionSchema = useAddSessionSchema([]);
    const {
        formState: { isValid },
        control,
        getValues,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(addSessionSchema),
        defaultValues: defaultValues || {},
    });

    const { mutate: createSessionUnderWeeklySession } = useCreateSessionUnderWeeklySession({
        onSuccess: () => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: 'Success',
                        subtitle: 'Session has been added under the weekly session',
                    },
                }),
            );

            setTimeout(() => {
                dispatch(closeModal());
            }, 3000);
        },
        onError: (error: any) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Error occurred',
                        subtitle: error.message || 'Failed to create session under weekly session',
                    },
                }),
            );
        },
    });

    const handleSave = async (): Promise<void> => {
        const selectedDate = getValues().date;

        if (defaultValues.weeklySessionId && academy?.id && selectedDate) {
            const payload = {
                date: selectedDate,
                type: getValues().type?.value,
                from: getValues().from,
                to: getValues().to,
                title: getValues().title || '',
                description: getValues().description || '',
                achievedSession: getValues().achievedSession || '',
                space: getValues().space || '',
            };

            createSessionUnderWeeklySession({
                weeklySessionId: defaultValues.weeklySessionId,
                sessionDetails: payload,
            });
        } else {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Date Missing',
                        subtitle: 'Please select a valid date before saving.',
                    },
                }),
            );
        }
    };

    return (
        <Body>
            <BoxContainer>
                <FormRow
                    title={trans('session.title')}
                    content={<InputController control={control} name="title" />}
                />
                <Divider />

                <FormRow
                    title={trans('session.description')}
                    content={<InputController control={control} name="description" isMultiline />}
                />

                <FormRow
                    title={trans('session.timePeriod')}
                    content={
                        <div className="flex justify-evenly w-full">
                            <div className="text-ellipsis w-[50%]">
                                <div className="font-bold">{trans('session.from')}</div>
                                <TimePicker name={'from'} control={control} />
                            </div>
                            <div className="text-ellipsis w-[50%]">
                                <div className="font-bold">{trans('session.to')}</div>
                                <TimePicker name={'to'} control={control} />
                            </div>
                        </div>
                    }
                />
                <Divider />

                <FormRow
                    title={trans('session.type')}
                    content={
                        <MultiSelectController
                            {...{
                                control,
                                name: 'type',
                                options: arrayToSelectOptions({ array: PlayingSessionType }),
                                transSuffix: 'session.',
                                menuPlacement: 'bottom',
                            }}
                        />
                    }
                />
            </BoxContainer>

            <BoxContainer>
                <FormRow
                    title={trans('session.achievedSession')}
                    content={<InputController control={control} name="achievedSession" />}
                />
                <Divider />

                <FormRow
                    title={trans('session.space')}
                    content={<InputController control={control} name="space" />}
                />
            </BoxContainer>

            <FormRow content={<ButtonsControls isValid={isValid} handleSave={handleSave} />} />
        </Body>
    );
};
