import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Theme from './Theme';
import { InputDateController } from '../../components/inputDate';
import { useForm, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { InputController } from '../../components/input';
import { LabelInput } from '../../components/labelInput';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSessionFormSchema } from '../../schemas/sessions/addSessionFormValidation';
import { router } from 'routers';
import './Style.css';
import { Gender } from 'libs/enums';
import { MultiSelectController } from 'components';
import { FormRow } from 'components/modal-windows/FormRow';
import { arrayToSelectOptions } from 'libs/helpers';
import TimePicker from 'components/modal-windows/add-session/TimePicker';
import { SharedButton } from 'components/sharedButton';

interface FormData {
    missionAssociated: string;
    volumeTargeted: number;
    sessionType: string;
    sessionTitle: string;
    space: string;
    avgPE: number;
    day: Date;
    note?: string | null;
    invitedPositions: string;
    from: Date;
    to: Date;
}

export const AddSessionPage = () => {
    const { trans } = useLocales();
    const handleViewTemplate = () => {
        router.navigate('add-sesstion-page/templates', {}, { replace: true });
    };
    const {
        control,
        formState: { errors, isValid },
        handleSubmit,
    } = useForm<FormData>({
        mode: 'all',
        resolver: yupResolver<FormData | any>(useSessionFormSchema()),
    });
    const onSubmit = (data: FormData) => {
        console.log(data, 'data');
    };

    return (
        <>
            <Theme.NavigationWrapper>
                <Theme.CreateSessionTitle>
                    {trans('title.CreateSessionTitle')}:
                </Theme.CreateSessionTitle>
                <Theme.NavigationButton onClick={handleViewTemplate}>
                    {trans('button.NavigatTemplates')}
                    <img src="/assets/icons/arrowleft.svg" alt="Arrow Icon" />
                </Theme.NavigationButton>
            </Theme.NavigationWrapper>
            <Theme.Body>
                <Theme.FlexWrapper>
                    <Theme.EvenWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.missionAssociated')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'missionAssociated',
                                            options: arrayToSelectOptions({ array: Gender }),
                                            transSuffix: 'form.editAthletePersonalInfo.',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>

                        <Theme.InputsWrapper>
                            <LabelInput label={trans('label.volumeTargeted')} />
                            <Controller
                                control={control}
                                name="volumeTargeted"
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputController
                                            {...field}
                                            control={control}
                                            placeholder={trans('placeholder.exVolume')}
                                        />
                                    </>
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.EvenWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.sessionType')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'sessionType',
                                            options: arrayToSelectOptions({ array: Gender }),
                                            transSuffix: 'form.editAthletePersonalInfo.',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>

                        <Theme.InputsWrapper>
                            <LabelInput label={trans('label.sessionTitle')} />
                            <Controller
                                control={control}
                                name="sessionTitle"
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputController
                                            {...field}
                                            control={control}
                                            placeholder={trans('placeholder.exSessionTitle')}
                                        />
                                    </>
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.EvenWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.space')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'space',
                                            options: arrayToSelectOptions({ array: Gender }),
                                            transSuffix: 'form.editAthletePersonalInfo.',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>

                        <Theme.InputsWrapper>
                            <LabelInput label={trans('label.avgPE')} />
                            <Controller
                                control={control}
                                name="avgPE"
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputController
                                            {...field}
                                            control={control}
                                            placeholder={trans('placeholder.zero')}
                                        />
                                    </>
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.EvenWrapper>

                    <Theme.PeriodWrapper>
                        <Theme.InputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.day')}
                                content={
                                    <InputDateController
                                        control={control}
                                        name="day"
                                        placeholder={trans('placeholder.day')}
                                    />
                                }
                            />
                        </Theme.InputsWrapper>

                        <Theme.InputsWrapperRangeTime className="hiddenYear">
                            {/* <LabelInput label={trans('createSession.labelTime.from')} />
                        <Controller
                            control={control}
                            name="startTime"
                            render={() => (
                                <Theme.DatePickerWrapper>
                                    <DatePicker
                                        name="startTime"
                                        selected={startTime}
                                        onChange={handleStartTimeChange}
                                        showTimeSelect
                                        timeIntervals={60}
                                        timeCaption={trans('label.startTime')}
                                        dateFormat="h:mm aa"
                                        placeholderText={trans('label.startTime')}
                                        showMonthDropdown={false}
                                        showYearDropdown={false}
                                        dropdownMode="select"
                                    />
                                    <img
                                        src="/assets/icons/arrwo.svg"
                                        height={20}
                                        width={20}
                                        alt="Calendar Icon"
                                    />
                                </Theme.DatePickerWrapper>
                            )}
                        />
                        <LabelInput label={trans('createSession.labelTime.to')} />
                        <Controller
                            control={control}
                            name="endTime"
                            render={() => (
                                <Theme.DatePickerWrapper>
                                    <DatePicker
                                        name="endTime"
                                        selected={endTime}
                                        onChange={handleEndTimeChange}
                                        showTimeSelect
                                        timeIntervals={60}
                                        timeCaption={trans('label.endTime')}
                                        dateFormat="h:mm aa"
                                        placeholderText={trans('label.endTime')}
                                        showMonthDropdown={false}
                                        showYearDropdown={false}
                                        dropdownMode="select"
                                    />
                                    <img
                                        src="/assets/icons/arrwo.svg"
                                        height={20}
                                        width={20}
                                        alt="Calendar Icon"
                                    />
                                </Theme.DatePickerWrapper>
                            )}
                        /> */}
                            <FormRow
                                style={{
                                    minHeight: '70px',
                                    margin: '0px',
                                }}
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
                        </Theme.InputsWrapperRangeTime>
                    </Theme.PeriodWrapper>

                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.noteOptional')} />
                        <Controller
                            control={control}
                            name="note"
                            render={({ field }) => (
                                <Theme.TextArea
                                    rows={3}
                                    {...field}
                                    value={field.value ?? ''}
                                    placeholder={trans('placeholder.description')}
                                />
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>

                    <Theme.FullWidthInputsWrapper>
                        <LabelInput label={trans('label.invitedPositions')} />
                        <Controller
                            control={control}
                            name="invitedPositions"
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        control={control}
                                        placeholder={trans('placeholder.choose')}
                                    />
                                </>
                            )}
                        />
                    </Theme.FullWidthInputsWrapper>

                    <SharedButton onClick={handleSubmit(onSubmit)}>
                        {trans('button.submit')}
                        <img
                            src="/assets/icons/add-icon.svg"
                            height={20}
                            width={20}
                            alt="Add Icon"
                        />
                    </SharedButton>
                </Theme.FlexWrapper>
            </Theme.Body>
        </>
    );
};
