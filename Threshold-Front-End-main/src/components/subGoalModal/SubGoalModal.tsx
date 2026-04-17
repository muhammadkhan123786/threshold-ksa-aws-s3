import React, { useState, useEffect } from 'react';
import moment from 'moment';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useRouter } from 'react-router5';
import { useDispatch } from 'react-redux';
import { FormRow } from 'components/modal-windows/FormRow';
import { arrayToSelectOptions } from 'libs/helpers';
import { setModalContent } from 'store/controlsSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputController } from 'components/input';
import { useAddSubGoal, useUpdateSubGoal } from 'services/hooks/goals/useUpdateOrCreateSubGoal';
import { useForm, Controller } from 'react-hook-form';
import { useNewSubGoalSchema } from 'schemas/goals/subGoalValidationSchema';
import { MultiSelectController } from 'components/multi-selection';
import { Months, UnitsSessions } from 'libs/enums';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { useFetchClubTeamsSubGoals } from 'services/hooks/teams/useFetchClubTeamsSubGoals';
import { Divider } from 'components/modal-windows';

interface SubGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingGoal?: any;
    goal?: any; // Pass the existing goal data here
}

const monthNameToNumberMap: { [key: string]: number } = {
    january: 1,
    february: 2,
    march: 3,
    april: 4,
    may: 5,
    june: 6,
    july: 7,
    august: 8,
    september: 9,
    october: 10,
    november: 11,
    december: 12,
};

export const SubGoalModal: React.FC<SubGoalModalProps> = ({
    isOpen,
    onClose,
    existingGoal,
    goal,
}) => {
    const { isRTL, trans } = useLocales();
    const dispatch = useDispatch();
    const router = useRouter();
    const {
        params: { sportId, id },
    } = router.getState();

    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [subGoalId, setSubGoalId] = useState('');
    const [weekDates, setWeekDates] = useState<{ startDate: string; endDate: string }[]>([]);

    const subGoalSchema = useNewSubGoalSchema();

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
        watch,
    } = useForm<any>({
        mode: 'all',
        resolver: yupResolver(subGoalSchema),
        defaultValues: existingGoal || {
            months: { value: 'january', label: trans('form.subGoal.january') }, // Default to January
            weeks: Array(4).fill({}),
        },
    });

    const { refetch } = useFetchClubTeamsSubGoals(sportId, id);
    const { mutateAsync: addSubGoal } = useAddSubGoal(sportId, id);
    const { mutateAsync: updateSubGoal } = useUpdateSubGoal(sportId, subGoalId);

    const selectedMonth = watch('months');
    const weeks = watch('weeks');

    // Function to convert Arabic numerals to standard numerals
    const arabicToStandardNumerals = (dateString: string) => {
        const arabicNumerals = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
        return dateString.replace(/[٠-٩]/g, (match) => {
            return arabicNumerals.indexOf(match).toString();
        });
    };

    // Function to format dates
    const formatDate = (dateString: string) => {
        const m = moment(dateString).locale(isRTL ? 'ar' : 'en'); // Force English locale for month abbreviations
        return m.format('MMM/D').toLowerCase(); // Format as "jan/1"
    };
    // Update weekDates when selectedMonth changes
    useEffect(() => {
        if (selectedMonth) {
            const monthNumber = monthNameToNumberMap[selectedMonth.value.toLowerCase()] || 0;
            const year = moment().year();
            const startOfMonth = moment()
                .year(year)
                .month(monthNumber - 1)
                .startOf('month');
            const endOfMonth = startOfMonth.clone().endOf('month');
            const lastDay = endOfMonth.date();

            const dates: any[] = [];
            const WEEK_STARTS = [1, 8, 15, 22]; // Fixed start days for 4 weeks

            WEEK_STARTS.forEach((startDay) => {
                const startDate = startOfMonth.clone().date(startDay);
                let endDay = startDay + 6;

                // Handle last week ending on month's last day
                if (startDay === 22) endDay = lastDay;
                else endDay = Math.min(endDay, lastDay);

                const endDate = startOfMonth.clone().date(endDay);

                dates.push({
                    startDate: startDate.format('YYYY-MM-DD'),
                    endDate: endDate.format('YYYY-MM-DD'),
                });
            });

            setWeekDates(dates);
        }
    }, [selectedMonth]);

    useEffect(() => {
        if (goal) {
            setSubGoalId(goal.id);
            const monthName = Object.keys(monthNameToNumberMap).find(
                (key) => monthNameToNumberMap[key] === goal.monthNumber,
            );
            reset({
                title: goal.title,
                months: { value: monthName, label: trans(`form.subGoal.${monthName}`) },
                weeks: goal.weeks.map((week: any) => ({
                    weekTitle: week.title,
                    volumeTargeted: week.volumeTargeted,
                    volumeUnit: { value: week.volumeUnit, label: week.volumeUnit },
                    totalSessions: week.totalSessions,
                    neededSessions: week.neededSessions,
                })),
            });
        }
    }, [goal, reset, trans]);

    const handleSave = async (data: any) => {
        setIsSubmittingForm(true);
        const monthNumber = monthNameToNumberMap[data.months?.value.toLowerCase()] || 0;

        const weeksData = data.weeks.filter((week: any) => {
            return (
                week.weekTitle ||
                week.volumeTargeted ||
                week.volumeUnit ||
                week.totalSessions ||
                week.neededSessions
            );
        });

        if (weeksData.length === 0) {
            console.warn('At least one week should have data.');
            setIsSubmittingForm(false);
            return;
        }

        // Construct the payload with startDate and endDate for each week
        const payload = {
            title: data.title,
            monthNumber: monthNumber,
            weeks: weeksData.map((week: any, index: number) => ({
                id: goal?.weeks[index]?.id,
                title: week.weekTitle || `Week ${index + 1}`,
                weekNumber: index + 1,
                startDate: arabicToStandardNumerals(weekDates[index]?.startDate),
                endDate: arabicToStandardNumerals(weekDates[index]?.endDate),
                volumeTargeted: week.volumeTargeted,
                volumeUnit: week.volumeUnit?.value,
                totalSessions: week.totalSessions,
                neededSessions: week.neededSessions,
            })),
        };

        try {
            const mutation = goal ? updateSubGoal : addSubGoal;
            const response = await mutation(payload);

            if ([200, 201].includes(response.status)) {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: trans('form.success'),
                            subtitle: goal
                                ? trans('subGoal.updated_successfully')
                                : trans('subGoal.created_successfully'),
                        },
                    }),
                );
                refetch();
                onClose();
                reset();
            } else {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: trans('form.warning'),
                            subtitle: response.message || trans('form.error_occurred'),
                        },
                    }),
                );
            }
        } catch (error: any) {
            console.error('Error occurred while saving subGoal:', error);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message || trans('form.error_occurred'),
                    },
                }),
            );
        } finally {
            setIsSubmittingForm(false);
        }
    };

    return (
        <SharedModal
            customHeight="100%"
            isOpen={isOpen}
            onRequestClose={onClose}
            title={trans(goal ? 'edit.subGoal' : 'add.subGoal')}
        >
            <Theme.Body>
                {/* Months Input */}
                <Theme.FullWidthInputsWrapperTwoInputs>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                            borderRadius: '8px',
                        }}
                        title={trans('label.months')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'months',
                                    options: arrayToSelectOptions({ array: Months }),
                                    transSuffix: 'form.subGoal.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{
                            fontSize: '14px',
                            display: 'block',
                            color: '#7d7d7d',
                            marginTop: '10px',
                            borderRadius: '8px',
                        }}
                        title={trans('add.sub.goal')}
                        content={
                            <Controller
                                control={control}
                                name="title"
                                render={({ field }) => (
                                    <InputController
                                        {...field}
                                        control={control}
                                        type="text"
                                        placeholder={trans('home.branchesList.description')}
                                    />
                                )}
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapperTwoInputs>

                {/* Weeks Inputs */}
                {weekDates.map((week, weekIndex) => {
                    const startDateFormatted = formatDate(week.startDate);
                    const endDateFormatted = formatDate(week.endDate);

                    return (
                        <>
                            <Divider />
                            <React.Fragment key={weekIndex}>
                                <Theme.InputsWrapper>
                                    <FormRow
                                        style={{
                                            fontSize: '14px',
                                            display: 'block',
                                            color: '#7d7d7d',
                                        }}
                                        title={`${trans('teams.add.title')} ${
                                            weekIndex + 1
                                        } - ${trans(`week.${weekIndex + 1}`)}`}
                                        titletow={`[${startDateFormatted} .. ${endDateFormatted}]`}
                                        content={
                                            <Controller
                                                control={control}
                                                name={`weeks[${weekIndex}].weekTitle`}
                                                render={({ field }) => (
                                                    <InputController
                                                        {...field}
                                                        control={control}
                                                        type="text"
                                                        placeholder={trans('teams.add.title')}
                                                    />
                                                )}
                                            />
                                        }
                                    />
                                </Theme.InputsWrapper>
                                <Theme.FullWidthInputsWrapperTwoInputs>
                                    <FormRow
                                        style={{
                                            fontSize: '14px',
                                            color: '#777777',
                                            display: 'block',
                                        }}
                                        contentStyle={{
                                            display: 'flex',
                                            gap: '4px',
                                        }}
                                        title={trans('label.volume.targeted')}
                                        content={
                                            <>
                                                <Controller
                                                    control={control}
                                                    name={`weeks[${weekIndex}].volumeTargeted`}
                                                    render={({ field }) => (
                                                        <InputController
                                                            control={control}
                                                            {...field}
                                                            type="number"
                                                            min={0}
                                                            placeholder={trans('teams.add.number')}
                                                        />
                                                    )}
                                                />
                                                <Controller
                                                    control={control}
                                                    name={`weeks[${weekIndex}].volumeUnit`}
                                                    render={({ field }) => (
                                                        <MultiSelectController
                                                            {...field}
                                                            control={control}
                                                            options={arrayToSelectOptions({
                                                                array: UnitsSessions,
                                                            })}
                                                        />
                                                    )}
                                                />
                                            </>
                                        }
                                    />
                                    <FormRow
                                        style={{
                                            fontSize: '14px',
                                            display: 'block',
                                            color: '#7d7d7d',
                                        }}
                                        title={trans('teams.add.sessionsNeeded')}
                                        content={
                                            <Controller
                                                control={control}
                                                name={`weeks[${weekIndex}].neededSessions`}
                                                render={({ field }) => (
                                                    <InputController
                                                        {...field}
                                                        type="number"
                                                        control={control}
                                                        min={0}
                                                        max={6}
                                                        placeholder={trans(
                                                            'teams.add.sessionsNumber',
                                                        )}
                                                    />
                                                )}
                                            />
                                        }
                                    />
                                </Theme.FullWidthInputsWrapperTwoInputs>
                            </React.Fragment>
                        </>
                    );
                })}

                {/* Save Button */}
                <Theme.InputMultiElemintsWrapperRight>
                    <SharedButton onClick={handleSubmit(handleSave)}>
                        {isSubmittingForm ? <SaveLoaderButton /> : trans('button.save')}
                    </SharedButton>
                </Theme.InputMultiElemintsWrapperRight>
            </Theme.Body>
        </SharedModal>
    );
};
