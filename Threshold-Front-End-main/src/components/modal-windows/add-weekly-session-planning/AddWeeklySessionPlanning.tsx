import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputController } from 'components/input';
import { InputDateController } from 'components/inputDate';
import { useLocales } from 'hooks/locales';
import moment from 'moment';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import * as Theme from './Theme';
import { useWeeklySessionSchema } from 'schemas/sessions/useWeeklySessionSchema';
import ButtonsControls from '../ButtonsControls';
import { Body } from '../Theme';
import { useCreateWeeklySession } from 'services/hooks/weeklySessions/useCreateWeeklySession';
import { useDispatch } from 'react-redux';
import { closeModal, setModalContent } from 'store/controlsSlice';
import { error } from 'console';

const AddWeeklySessionPlanning: React.FC<
    FormWindowProps & FormControlsProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { defaultValues } = props;

    const { trans } = useLocales();
    const dispatch = useDispatch();
    const schema = useWeeklySessionSchema();
    const {
        control,
        handleSubmit,
        watch,
        formState: { isValid, errors },
        setValue,
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: schema.cast({}),
        mode: 'all',
    });

    const { mutate: createSessionUnderWeeklySession } = useCreateWeeklySession({
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
    const selectedWeekDate = watch('weekDate');
    const selectedDays: (string | undefined)[] = watch('days') || [];

    const getWeekDays = (startDate: Date) => {
        return Array.from({ length: 7 }, (_, i) => {
            const day = moment(startDate).add(i, 'days');
            return {
                dayName: day.format('dddd'),
                date: day.format('DD-MM-YYYY'),
                isSelected: selectedDays.includes(day.format('DD-MM-YYYY')),
            };
        });
    };

    const weekDays = getWeekDays(selectedWeekDate);

    const toggleDay = (date: string) => {
        const updatedDays = selectedDays.includes(date)
            ? selectedDays.filter((d): d is string => d !== date && !!d)
            : [...selectedDays, date].filter((d): d is string => !!d);

        setValue('days', updatedDays);
    };

    const handleSubmitWithCleanedData = handleSubmit((data) => {
        const formattedWeekDate = moment(data.weekDate, 'DD-MM-YYYY', 'fa')
            .locale('en')
            .format('YYYY-MM-DD');

        createSessionUnderWeeklySession({
            teamId: defaultValues?.teamId,
            weeklySession: {
                title: data.title,
                description: data.description,
                weekTarget: data.target,
                weekDate: formattedWeekDate,
                sessionDays: data.days.map((date) => ({ date })),
            },
        });
    });

    return (
        <Body>
            <form onSubmit={handleSubmitWithCleanedData}>
                <Theme.SectionTitle>{trans('session.information')}</Theme.SectionTitle>

                <FormRow
                    title={trans('session.title')}
                    content={
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'title',
                            }}
                        />
                    }
                />

                <FormRow
                    title={trans('session.description')}
                    content={
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'description',
                                isMultiline: true,
                            }}
                        />
                    }
                />

                <FormRow
                    title={trans('session.target')}
                    content={
                        <InputController
                            type="number"
                            {...{
                                control,
                                name: 'target',
                            }}
                        />
                    }
                />

                <FormRow
                    title={trans('session.weekDate')}
                    content={
                        <InputDateController
                            {...{
                                control,
                                name: 'weekDate',
                                withPortal: false,
                                maxDate: undefined,
                            }}
                        />
                    }
                />

                <Theme.Divider />

                <Theme.SectionTitle>{trans('session.days')}</Theme.SectionTitle>
                <Theme.DaySelector>
                    {weekDays.map(({ dayName, date, isSelected }) => (
                        <Theme.DayButton
                            key={date}
                            type="button"
                            isSelected={isSelected}
                            onClick={() => toggleDay(date)}
                        >
                            {trans(dayName)} <br />
                            {date}
                        </Theme.DayButton>
                    ))}
                </Theme.DaySelector>

                <FormRow
                    content={
                        <ButtonsControls
                            // isValid={isValid}
                            handleSave={handleSubmitWithCleanedData}
                        />
                    }
                />
            </form>
        </Body>
    );
};

export default AddWeeklySessionPlanning;
