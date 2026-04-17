import React, { Fragment } from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { InputDateController } from 'components/inputDate';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { arrayToSelectOptions, getDateYearsFromNow, selectOptionsToValues } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { MultiSelectController } from 'components/multi-selection';
import { SessionRecordStatus, PlayingSessionType, UserRole } from 'libs/enums';
import { useAddSessionSchema } from 'schemas/team/addSession';
import { closeModal, setModalContent } from 'store/controlsSlice';
import * as Theme from './Theme';
import { getAvatarPlaceholder } from 'libs/constants';
import { InputController } from 'components/input';
import { sessionAPIs } from 'services/apis';
import TimePicker from './TimePicker';
import moment from 'moment';
import { WithRole } from 'hooks/roles';

export const AddSession: React.FC<
    FormWindowProps & FormControlsProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans, timezonDate, isFutureDateSelected } = useLocales();
    const dispatch = useDispatch();
    const { defaultValues, id: teamId } = props;
    const { academy, currentTeam } = useSelector(selectAcademy);

    const addSessionSchema = useAddSessionSchema(currentTeam?.athletes || []);
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

    const isFutureDate = isFutureDateSelected(watch('date'));

    const handleSave = async () => {
        try {
            if (teamId && academy?.id) {
                let formData = {};
                if (isFutureDate)
                    formData = selectOptionsToValues(getValues(), ['type', 'dayPeriod']);
                else {
                    formData = selectOptionsToValues(getValues(), [
                        'type',
                        'dayPeriod',
                        ...(currentTeam?.athletes || []).reduce(
                            (acc, { id }) => [...acc, `status@${id}`],
                            [] as string[],
                        ),
                    ]);
                }

                const date = timezonDate(getValues().date);
                formData = { ...formData, date };

                const response = await dispatch(
                    sessionAPIs.createSession()({
                        ...formData,
                        team: teamId,
                        academy: academy?.id,
                    }),
                );

                const isSuccess = [201, 200].includes(response?.payload?.status);

                if (isSuccess) {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'success',
                                title: 'Success',
                                subtitle: 'Session has been added',
                            },
                        }),
                    );

                    setTimeout(() => {
                        dispatch(closeModal());
                    }, 3000);
                } else {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: 'warning',
                                title: 'Warning',
                                subtitle: response?.payload?.payload?.message,
                            },
                        }),
                    );
                }
            }
        } catch (error) {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Error occurred',
                        subtitle: '',
                    },
                }),
            );
        }
    };

    return (
        <Body>
            <FormRow
                title={trans('session.date')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'date',
                        }}
                        maxDate={getDateYearsFromNow(0, 1, 'future')}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('session.dayPeriod')}
                content={<div>{moment(timezonDate(watch('date'))).format('dddd')}</div>}
            />
            <Divider />

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
            <Divider />

            {!isFutureDate && (
                <WithRole
                    blockRoles={[
                        UserRole.ACADEMY_ADMIN,
                        UserRole.COACH,
                        UserRole.MEMBER,
                        UserRole.ACADEMY_COORDINATOR,
                        UserRole.CLUB_ADMIN,
                    ]}
                >
                    <Theme.AthletesList>
                        <Theme.ListHeader>{trans('session.teamList')}</Theme.ListHeader>
                        <Theme.ListHeader>{trans('session.athleteStatus')}</Theme.ListHeader>
                        <Theme.ListHeader>{trans('session.athleteComment')}</Theme.ListHeader>

                        {currentTeam &&
                            currentTeam.athletes &&
                            currentTeam.athletes?.length > 0 &&
                            currentTeam.athletes.map(({ id, avatar, firstName, lastName }) => (
                                <Fragment key={id}>
                                    <Theme.ListAthleteWrapper>
                                        <Theme.ListAvatar
                                            src={avatar || getAvatarPlaceholder()}
                                            alt={firstName}
                                        />
                                        <Theme.ListAthleteName>{`${firstName} ${lastName}`}</Theme.ListAthleteName>
                                    </Theme.ListAthleteWrapper>

                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: `status@${id}`,
                                            options: arrayToSelectOptions({
                                                array: SessionRecordStatus,
                                            }),
                                            transSuffix: 'session.',
                                            menuPlacement: 'top',
                                        }}
                                        style={{
                                            margin: 'auto',
                                        }}
                                    />

                                    <InputController
                                        control={control}
                                        name={`comment@${id}`}
                                        disabled={watch(`status@${id}`)?.value === 'present'}
                                    />
                                </Fragment>
                            ))}
                    </Theme.AthletesList>
                </WithRole>
            )}

            {/* buttons */}
            <FormRow content={<ButtonsControls isValid={isValid} handleSave={handleSave} />} />
        </Body>
    );
};
