import React, { useEffect, useMemo, useState, JSX } from 'react';
import { useLocales } from 'hooks/locales';
import { useForm } from 'react-hook-form';
import {
    AthleteStatus,
    HandStatus,
    PlayerPosition,
    SportProfileType,
    EventType,
    SwimmingEventType,
} from 'libs/enums';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import {
    arrayToSelectOptions,
    handleSportProfileActions,
    selectOptionsToValues,
} from 'libs/helpers';
import { MultiSelectController } from 'components/multi-selection';
import { yupResolver } from '@hookform/resolvers/yup';
import { EDIT_SPORT_PROFILE_DEFAULTS, useEditSportProfileTypeSchema } from 'schemas';
import ButtonsControls from '../ButtonsControls';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { CheckBoxes } from 'components/check-Boxes';
import { getOptions } from './optionsHelper';
import {
    AthleticsEventType,
    BasketballPlayerPosition,
    HandballPlayerPosition,
    NetballPlayerPosition,
} from 'libs/enums/athlete';
import { useMount } from 'hooks/mount';

export const SportProfileForm: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
            isEdit: boolean;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const [isAthletics, setAthletics] = useState(false);
    const [isSwimming, setSwimming] = useState(false);
    const [isTennis, setTennis] = useState(false);
    const [sportValue, setSelectedSport] = useState('');
    const { trans } = useLocales();
    const { defaultValues, id: athleteId, isEdit } = props;
    const { currentProfile } = useSelector(selectAcademy);
    const dispatch = useDispatch();
    const isMounted = useMount();
    const editSportProfileTypeSchema = useEditSportProfileTypeSchema(sportValue);
    const {
        formState: { isValid },
        control,
        getValues,
        watch,
        reset,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editSportProfileTypeSchema),
        defaultValues: {
            ...EDIT_SPORT_PROFILE_DEFAULTS,
            ...defaultValues,
        },
    });

    const selectedSport = watch('sport');
    const eventType = watch('eventType')?.value;
    const selectIsValid = useMemo(
        () => !!watch('status') && !!watch('sport'),
        [watch('status'), watch('sport')],
    );

    const options = useMemo(() => getOptions(trans), [trans]);

    const handleSave = async () => {
        await handleSportProfileActions(
            currentProfile?.id,
            isAthletics || isSwimming
                ? selectOptionsToValues({ ...getValues(), athleteId }, [
                      'status',
                      'sport',
                      'eventType',
                  ])
                : isTennis
                  ? selectOptionsToValues({ ...getValues(), athleteId }, ['status', 'sport'])
                  : selectOptionsToValues({ ...getValues(), athleteId }, [
                        'status',
                        'sport',
                        'hand',
                        'position',
                        'foot',
                    ]),
            dispatch,
            isEdit,
        );
    };

    useEffect(() => {
        setAthletics(selectedSport?.value === SportProfileType.ATHLETICS);
        setSwimming(selectedSport?.value === SportProfileType.SWIMMING);
        setTennis(selectedSport?.value === SportProfileType.TENNIS);
        setSelectedSport(selectedSport?.value);
    }, [selectedSport?.value]);

    useEffect(() => {
        if (!isMounted) {
            reset({ ...EDIT_SPORT_PROFILE_DEFAULTS, sport: selectedSport });
        }
    }, [selectedSport?.value]);

    const renderFields = (fields: JSX.Element[]) => (
        <>
            {fields.map((field, index) => (
                <React.Fragment key={index}>
                    {field}
                    {index < fields.length - 1 && <Divider />}
                </React.Fragment>
            ))}
        </>
    );

    const renderTrackEventsFields = () =>
        renderFields([
            <FormRow
                key="sprint"
                title={trans('profileColumnName.sprint')}
                content={<CheckBoxes control={control} name="sprint" options={options.sprints} />}
            />,
            <FormRow
                key="middleDistance"
                title={trans('profileColumnName.middleDistance')}
                content={
                    <CheckBoxes
                        control={control}
                        name="middleDistance"
                        options={options.middleDistance}
                    />
                }
            />,
            <FormRow
                key="longDistance"
                title={trans('profileColumnName.longDistance')}
                content={
                    <CheckBoxes
                        control={control}
                        name="longDistance"
                        options={options.longDistance}
                    />
                }
            />,
            <FormRow
                key="hurdles"
                title={trans('profileColumnName.hurdles')}
                content={<CheckBoxes control={control} name="hurdles" options={options.hurdles} />}
            />,
            <FormRow
                key="relay"
                title={trans('profileColumnName.relay')}
                content={<CheckBoxes control={control} name="relay" options={options.relays} />}
            />,
            <FormRow
                key="steeplechase"
                title={trans('profileColumnName.steeplechase')}
                content={
                    <CheckBoxes
                        control={control}
                        name="steeplechase"
                        options={options.steeplechase}
                    />
                }
            />,
        ]);

    const renderFieldEventsFields = () =>
        renderFields([
            <FormRow
                key="jumps"
                title={trans('profileColumnName.jumps')}
                content={<CheckBoxes control={control} name="jumps" options={options.jumps} />}
            />,
            <FormRow
                key="throws"
                title={trans('profileColumnName.throws')}
                content={<CheckBoxes control={control} name="throws" options={options.throws} />}
            />,
        ]);

    const renderCombinedEventsFields = () =>
        renderFields([
            <FormRow
                key="heptathlon"
                title={trans('profileColumnName.heptathlon')}
                content={
                    <CheckBoxes control={control} name="heptathlon" options={options.heptathlon} />
                }
            />,
            <FormRow
                key="decathlon"
                title={trans('profileColumnName.decathlon')}
                content={
                    <CheckBoxes control={control} name="decathlon" options={options.decathlon} />
                }
            />,
        ]);

    const renderRoadRunningEventsFields = () =>
        renderFields([
            <FormRow
                key="five_kilometers"
                title={trans('profileColumnName.five_kilometers')}
                content={
                    <CheckBoxes
                        control={control}
                        name="five_kilometers"
                        options={options.fiveKilometers}
                    />
                }
            />,
            <FormRow
                key="ten_kilometers"
                title={trans('profileColumnName.ten_kilometers')}
                content={
                    <CheckBoxes
                        control={control}
                        name="ten_kilometers"
                        options={options.tenKilometers}
                    />
                }
            />,
            <FormRow
                key="half_marathon"
                title={trans('profileColumnName.half_marathon')}
                content={
                    <CheckBoxes
                        control={control}
                        name="half_marathon"
                        options={options.halfMarathon}
                    />
                }
            />,
            <FormRow
                key="marathon"
                title={trans('profileColumnName.marathon')}
                content={
                    <CheckBoxes control={control} name="marathon" options={options.marathon} />
                }
            />,
        ]);

    const renderIndividualSwimmingFields = () =>
        renderFields([
            <FormRow
                key="freestyle"
                title={trans('profileColumnName.freestyle')}
                content={
                    <CheckBoxes
                        control={control}
                        name="freestyle"
                        options={options.freestyleDistances}
                    />
                }
            />,
            <FormRow
                key="backstroke"
                title={trans('profileColumnName.backstroke')}
                content={
                    <CheckBoxes
                        control={control}
                        name="backstroke"
                        options={options.backstrokeDistances}
                    />
                }
            />,
            <FormRow
                key="breaststroke"
                title={trans('profileColumnName.breaststroke')}
                content={
                    <CheckBoxes
                        control={control}
                        name="breaststroke"
                        options={options.breaststrokeDistances}
                    />
                }
            />,
            <FormRow
                key="butterfly"
                title={trans('profileColumnName.butterfly')}
                content={
                    <CheckBoxes
                        control={control}
                        name="butterfly"
                        options={options.butterflyDistances}
                    />
                }
            />,
            <FormRow
                key="im"
                title={trans('profileColumnName.im')}
                content={<CheckBoxes control={control} name="im" options={options.imDistances} />}
            />,
        ]);

    const renderRelaySwimmingFields = () =>
        renderFields([
            <FormRow
                key="freestyleRelay"
                title={trans('profileColumnName.freestyleRelay')}
                content={
                    <>
                        <CheckBoxes
                            control={control}
                            name="freestyleRelay"
                            options={[
                                {
                                    value: '4x100_meters',
                                    label: trans('sport.relayEvents.freestyleRelay.4x100_meters'),
                                },
                                {
                                    value: '4x200_meters',
                                    label: trans('sport.relayEvents.freestyleRelay.4x200_meters'),
                                },
                            ]}
                        />
                    </>
                }
            />,
            <FormRow
                key="medleyRelay"
                title={trans('profileColumnName.medleyRelay')}
                content={
                    <>
                        <CheckBoxes
                            control={control}
                            name="medleyRelay"
                            options={[
                                {
                                    value: '4x100_meters',
                                    label: trans('sport.relayEvents.medleyRelay.4x100_meters'),
                                },
                            ]}
                        />
                    </>
                }
            />,
        ]);

    const renderOpenWaterSwimmingFields = () =>
        renderFields([
            <FormRow
                key="openWaterSwimming"
                title={trans('profileColumnName.openWaterSwimming')}
                content={
                    <CheckBoxes
                        control={control}
                        name="openWaterSwimming"
                        options={options.openWaterSwimming}
                    />
                }
            />,
        ]);

    const renderAthleticsFields = () => (
        <>
            <FormRow
                title={trans('form.editSportProfileType.eventType')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'eventType',
                            options: arrayToSelectOptions({ array: AthleticsEventType }),
                            menuPlacement: 'bottom',
                            transSuffix: 'sport.eventType.',
                        }}
                    />
                }
            />
            <Divider />
            {eventType === EventType.TRACK_EVENTS && renderTrackEventsFields()}
            {eventType === EventType.FIELD_EVENTS && renderFieldEventsFields()}
            {eventType === EventType.COMBINED_EVENTS && renderCombinedEventsFields()}
            {eventType === EventType.ROAD_RUNNING_EVENTS && renderRoadRunningEventsFields()}
        </>
    );

    const renderSwimmingFields = () => (
        <>
            <FormRow
                title={trans('form.editSportProfileType.eventType')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'eventType',
                            options: arrayToSelectOptions({ array: SwimmingEventType }),
                            menuPlacement: 'bottom',
                            transSuffix: 'sport.swimming.eventType.',
                        }}
                    />
                }
            />
            <Divider />
            {eventType === SwimmingEventType.INDIVIDUAL_EVENTS && renderIndividualSwimmingFields()}
            {eventType === SwimmingEventType.RELAY_EVENTS && renderRelaySwimmingFields()}
            {eventType === SwimmingEventType.OPEN_WATER_SWIMMING && renderOpenWaterSwimmingFields()}
        </>
    );

    const renderTennisFields = () =>
        renderFields([
            <FormRow
                key="squad"
                title={trans('profileColumnName.squad')}
                content={
                    <CheckBoxes control={control} name="squad" options={options.tennisSquad} />
                }
            />,
        ]);

    const getPlayerPositionOptions = (sport: string) => {
        switch (sport) {
            case SportProfileType.BASKETBALL:
                return Object.values(BasketballPlayerPosition);
            case SportProfileType.HANDBALL:
                return Object.values(HandballPlayerPosition);
            case SportProfileType.NETBALL:
                return Object.values(NetballPlayerPosition);
            default:
                return Object.values(PlayerPosition);
        }
    };

    const renderDefaultFields = () =>
        renderFields([
            <FormRow
                key="foot"
                title={trans('profileColumnName.foot')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'foot',
                            options: arrayToSelectOptions({ array: HandStatus }),
                            transSuffix: 'global.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />,
            <FormRow
                key="hand"
                title={trans('profileColumnName.hand')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'hand',
                            options: arrayToSelectOptions({ array: HandStatus }),
                            transSuffix: 'global.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />,
            <FormRow
                key="position"
                title={trans('profileColumnName.position')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'position',
                            options: arrayToSelectOptions({
                                array: getPlayerPositionOptions(selectedSport?.value),
                            }),
                            transSuffix: 'global.',
                            menuPlacement: 'top',
                        }}
                    />
                }
            />,
        ]);

    return (
        <Body>
            <FormRow
                title={trans('form.editSportProfileType.sport')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'sport',
                            options: arrayToSelectOptions({
                                array: Object.values(SportProfileType),
                            }),
                            transSuffix: 'sport.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.editSportProfileType.status')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'status',
                            options: arrayToSelectOptions({ array: AthleteStatus }),
                            transSuffix: 'global.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            {selectedSport?.value === SportProfileType.ATHLETICS
                ? renderAthleticsFields()
                : selectedSport?.value === SportProfileType.SWIMMING
                  ? renderSwimmingFields()
                  : selectedSport?.value === SportProfileType.TENNIS
                    ? renderTennisFields()
                    : renderDefaultFields()}
            <FormRow
                content={
                    <ButtonsControls isValid={isValid && selectIsValid} handleSave={handleSave} />
                }
            />
        </Body>
    );
};
