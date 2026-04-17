import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { LabelInput } from '../../labelInput';
import { AgeGroups, SkillLevel, SubscriptionPeriod, YesNo } from 'libs/enums';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { InputDateController } from 'components/inputDate';
import { Divider } from 'components/modal-windows';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import {
    AthleticsEvent,
    FootballPosition,
    SwimmingDistance,
    KarateBelt,
    TaekwondoBelt,
    JudoBelt,
    JujutsuBelt,
    FutsalPosition,
    BeachVolleyballEvent,
    PadelEvent,
    TriathlonEvent,
    BalootEvent,
    WrestlingEvent,
    MuayThaiEvent,
    BoxingEvent,
    GymnasticsEvent,
    FencingEvent,
    ArcheryEvent,
    EquestrianEvent,
    BilliardSnookerEvent,
    BadmintonEvent,
    ChessEvent,
    BowlingEvent,
    BeachSoccerEvent,
    SportClimbingEvent,
    ShootingEvent,
    SkateboardingEvent,
    Basketball3x3Event,
    SquashEvent,
    EsportsEvent,
    PingPongEvent,
    TennisEvent,
    HandballEvent,
    VolleyballEvent,
    BasketballEvent,
    CricketEvent,
    WaterPolo,
    NetballPosition,
} from '../../../libs/enums';
import { router } from 'routers';
import { InputController } from 'components/input';

export const FileInformation: React.FC = () => {
    const { trans } = useLocales();
    const [postionPlayersGameOptions, setPostionPlayersGameOptions] = useState<any>();
    const {
        control,
        formState: { errors },
        watch,
        setValue,
    } = useFormContext();
    const { academy } = useSelector(selectAcademy);
    const { data, isPending } = useClubList(academy.id);
    const {
        params: { sportId },
    } = router.getState();

    // Function to map sport types to their corresponding options
    const getPositionPlayersGameOptions = (sport: string) => {
        const sportMappings: { [key: string]: any } = {
            football: FootballPosition,
            athletics: AthleticsEvent,
            swimming: SwimmingDistance,
            karate: KarateBelt,
            taekwondo: TaekwondoBelt,
            judo: JudoBelt,
            jujutsu: JujutsuBelt,
            futsal: FutsalPosition,
            beach_volleyball: BeachVolleyballEvent,
            padel: PadelEvent,
            triathlon: TriathlonEvent,
            baloot: BalootEvent,
            wrestling: WrestlingEvent,
            muay: MuayThaiEvent,
            boxing: BoxingEvent,
            gymnastics: GymnasticsEvent,
            fencing: FencingEvent,
            archery: ArcheryEvent,
            equestrian: EquestrianEvent,
            billiardSnooker: BilliardSnookerEvent,
            badminton: BadmintonEvent,
            chess: ChessEvent,
            bowling: BowlingEvent,
            beachSoccer: BeachSoccerEvent,
            sportClimbing: SportClimbingEvent,
            shooting: ShootingEvent,
            skateboarding: SkateboardingEvent,
            basketball3x3: Basketball3x3Event,
            squash: SquashEvent,
            esports: EsportsEvent,
            ping_pong: PingPongEvent,
            tennis: TennisEvent,
            handball: HandballEvent,
            volleyball: VolleyballEvent,
            basketball: BasketballEvent,
            cricket: CricketEvent,
            water_polo: WaterPolo,
            netball: NetballPosition,
        };
        return sportMappings[sport] || [];
    };
    useEffect(() => {
        if (data?.payload) {
            const filteredSport = data?.payload.find((club) => club?.id === sportId);
            if (filteredSport) {
                const sportData = getPositionPlayersGameOptions(filteredSport.sport);
                setPostionPlayersGameOptions(sportData);
            } else {
                setPostionPlayersGameOptions([]);
            }
        }
    }, [data, sportId]);

    return (
        <Theme.Body>
            <Theme.GridWrapper>
                <Theme.InputsWrapper>
                    <FormRow
                        style={{
                            fontSize: '14px',
                            color: '#777777',
                            display: 'block',
                        }}
                        title={trans('label.joinedDate')}
                        content={
                            <InputDateController
                                control={control}
                                name="joinDate"
                                placeholder={trans('placeholder.joinedDate')}
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
                        title={trans('label.periodOfSubscription')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'periodOfSubscription',
                                    options: arrayToSelectOptions({ array: SubscriptionPeriod }),
                                    transSuffix: 'form.subscriptionManagement.periodSubscription.',
                                    menuPlacement: 'bottom',
                                    value: watch('periodOfSubscription'),
                                    onChange: (value: any) =>
                                        setValue('periodOfSubscription', value),
                                }}
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
                        title={trans('label.position.new')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'position',
                                    options: arrayToSelectOptions({
                                        array: postionPlayersGameOptions || {},
                                    }),
                                    transSuffix: 'form.add.player.',
                                    menuPlacement: 'bottom',
                                    value: watch('position'),
                                    onChange: (value: any) => setValue('position', value),
                                }}
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
                        title={trans('label.category')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'category',
                                    options: arrayToSelectOptions({ array: AgeGroups }),
                                    transSuffix: 'form.subscriptionManagement.periodSubscription.',
                                    menuPlacement: 'bottom',
                                    value: watch('category'),
                                    onChange: (value: any) => setValue('category', value),
                                }}
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
                        title={trans('label.level')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'clublevel',
                                    options: arrayToSelectOptions({ array: SkillLevel }),
                                    transSuffix: 'form.add.player.',
                                    menuPlacement: 'bottom',
                                    value: watch('clublevel'),
                                    onChange: (value: any) => setValue('clublevel', value),
                                }}
                            />
                        }
                    />
                </Theme.InputsWrapper>
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.weight')} />
                    <Controller
                        control={control}
                        name="weight"
                        render={({ field }) => (
                            <InputController
                                {...field}
                                type="number"
                                control={control}
                                placeholder={trans('placeholder.weight')}
                            />
                        )}
                    />
                </Theme.InputsWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
