import React, { useState, useEffect } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useRouter } from 'react-router5';
import { useDispatch } from 'react-redux';
import { FormRow } from 'components/modal-windows/FormRow';
import { InputDateController } from 'components/inputDate';
import { setModalContent } from 'store/controlsSlice';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputController } from 'components/input';
import { Controller, useForm } from 'react-hook-form';
import { useNewYearGoalSchema } from 'schemas/goals/YearGoalValidationSchema';
import { SharedButton } from 'components/sharedButton';
import { LabelInput } from 'components/labelInput';
import { useAddYearGoal, useUpdateYearGoal } from 'services/hooks/goals/useUpdateOrCreateMainGoal';
import { useFetchClubTeamsMainGoals } from 'services/hooks/teams/useFetchClubTeamsMainGoals';
import moment from 'moment';

interface YearGoalModalProps {
    isOpen: boolean;
    onClose: () => void;
    existingGoal?: any;
    yearForMainGoal?: number; // Expecting a number like 2022
}

export const YearGoalModal: React.FC<YearGoalModalProps> = ({
    isOpen,
    onClose,
    existingGoal,
    yearForMainGoal,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [yearDate, setYear] = useState<any>();
    const router = useRouter();
    const {
        params: { sportId, id },
    } = router.getState();

    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const [goalId, setGoalId] = useState(existingGoal?.id || '');
    const yearGoalSchema = useNewYearGoalSchema();
    const {
        control,
        handleSubmit,
        reset,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        mode: 'all',
        resolver: yupResolver(yearGoalSchema),
        defaultValues: {
            title: '',
            description: '',
            year: yearForMainGoal ? yearForMainGoal.toString() : moment().year().toString(), // Set initial year from props
            startDate: moment().startOf('year').toDate(),
            endDate: moment().endOf('year').toDate(),
        },
    });

    const year = watch('year');

    // Update the form when yearForMainGoal changes
    useEffect(() => {
        if (yearForMainGoal) {
            const parsedYear = moment(yearForMainGoal, 'YYYY').year();
            if (parsedYear) {
                const startDate = moment(parsedYear, 'YYYY').startOf('year').toDate();
                const endDate = moment(parsedYear, 'YYYY').endOf('year').toDate();

                reset({
                    year: parsedYear.toString(),
                    startDate: startDate,
                    endDate: endDate,
                });

                trigger('endDate');
                trigger('startDate');
            }
        }
    }, [yearForMainGoal, reset, trigger]);

    // Handle year changes
    useEffect(() => {
        if (year) {
            const parsedYear = moment(year, 'YYYY').year();
            if (parsedYear) {
                const startDate = moment(parsedYear, 'YYYY').startOf('year').toDate();
                const endDate = moment(parsedYear, 'YYYY').endOf('year').toDate();

                reset({
                    year: parsedYear.toString(),
                    startDate: startDate,
                    endDate: endDate,
                });

                trigger('endDate');
                trigger('startDate');
            }
        }
    }, [year, reset, trigger]);

    const { refetch } = useFetchClubTeamsMainGoals(sportId, id);
    const { mutateAsync: addYearGoal } = useAddYearGoal(sportId, id);
    const { mutateAsync: updateYearGoal } = useUpdateYearGoal(sportId, goalId);

    // Reset form when existingGoal changes
    useEffect(() => {
        if (existingGoal) {
            reset({
                title: existingGoal.title,
                description: existingGoal.description,
                year: existingGoal.year.toString(),
                startDate: new Date(existingGoal.year, 0, 1),
                endDate: new Date(existingGoal.year, 11, 31, 23, 59, 59),
            });
            setGoalId(existingGoal.id);
        } else {
            const currentYear = yearForMainGoal || new Date().getFullYear();
            reset({
                title: '',
                description: '',
                year: currentYear.toString(),
                startDate: new Date(currentYear, 0, 1),
                endDate: new Date(currentYear, 11, 31, 23, 59, 59),
            });
            setGoalId('');
        }
    }, [existingGoal, yearForMainGoal, reset]);

    const handleSave = async (data: any) => {
        setIsSubmittingForm(true);

        const year = new Date(data.year).getFullYear();
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31, 23, 59, 59);

        const payload = {
            title: data.title,
            description: data.description,
            year: year,
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
        };

        try {
            const mutation = goalId ? updateYearGoal : addYearGoal;
            const response = await mutation(payload);

            if ([200, 201].includes(response.status)) {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: trans('form.success'),
                            subtitle: goalId
                                ? trans('yearGoal.updated_successfully')
                                : trans('yearGoal.created_successfully'),
                        },
                    }),
                );
                onClose();
                reset();
                refetch();
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
            console.error('Error occurred while saving yearGoal:', error);
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
            isOpen={isOpen}
            onRequestClose={onClose}
            title={trans(goalId ? 'edit.year.goal' : 'add.year.goal')}
        >
            <Theme.Body>
                <Theme.FullWidthInputsWrapper>
                    <LabelInput label={trans('goal.title')} />
                    <Controller
                        control={control}
                        name="title"
                        render={({ field, fieldState }) => (
                            <InputController
                                {...field}
                                control={control}
                                placeholder={trans('goal.title_placeholder')}
                            />
                        )}
                    />
                </Theme.FullWidthInputsWrapper>
                <Theme.FullWidthInputsWrapper>
                    <LabelInput label={trans('goal.description')} />
                    <Controller
                        control={control}
                        name="description"
                        render={({ field, fieldState }) => (
                            <InputController
                                {...field}
                                control={control}
                                placeholder={trans('goal.description_placeholder')}
                            />
                        )}
                    />
                </Theme.FullWidthInputsWrapper>
                <Theme.FullWidthInputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('goal.year')}
                        content={
                            <InputDateController
                                control={control}
                                trigger={trigger}
                                name="year"
                                dateFormat="yyyy"
                                minDate={new Date('01/01/2000')}
                                placeholder={trans('goal.year_placeholder')}
                                disabled={!!yearForMainGoal} // Disable if yearForMainGoal is provided
                            />
                        }
                    />
                </Theme.FullWidthInputsWrapper>
                <Theme.FullWidthInputsWrapperTwoInputs>
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('goal.startDate')}
                            content={
                                <InputDateController
                                    control={control}
                                    name="startDate"
                                    trigger={trigger}
                                    placeholder={trans('goal.startDate_placeholder')}
                                    disabled
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                    <Theme.InputsWrapper>
                        <FormRow
                            style={{
                                fontSize: '14px',
                                color: '#777777',
                                display: 'block',
                            }}
                            title={trans('goal.endDate')}
                            content={
                                <InputDateController
                                    control={control}
                                    trigger={trigger}
                                    name="endDate"
                                    placeholder={trans('goal.endDate_placeholder')}
                                    disabled
                                />
                            }
                        />
                    </Theme.InputsWrapper>
                </Theme.FullWidthInputsWrapperTwoInputs>
                <Theme.InputMultiElemintsWrapperRight>
                    <SharedButton onClick={handleSubmit(handleSave)} disabled={isSubmittingForm}>
                        <img
                            src="/assets/icons/save-icon.svg"
                            height={20}
                            width={20}
                            alt="Save Icon"
                        />
                        {isSubmittingForm ? trans('loading') : trans('goal.saveButton.modal')}
                    </SharedButton>
                </Theme.InputMultiElemintsWrapperRight>
            </Theme.Body>
        </SharedModal>
    );
};
