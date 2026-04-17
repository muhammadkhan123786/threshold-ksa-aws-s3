import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Athlete, AthleteProfile } from 'libs/types';
import { AthleteStatus, HandStatus, SportProfileType, UserRole } from 'libs/enums';
import { StatusIndicator } from 'components/status-indicator';
import { setCurrentProfile } from 'store/academySlice';
import { setModalContent } from 'store/controlsSlice';
import { valueToSelectOption } from 'libs/helpers';
import { Card } from 'components/card/Card';
import { WithRole } from 'hooks/roles';
import { DefaultPosition, EventType } from 'libs/enums/athlete';

interface Props {
    athlete?: Athlete;
    profiles: AthleteProfile[];
}

export const ProfilesCard = ({ profiles }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const handleAddProfile = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addSportProfileType',
                    title: trans('form.editSportProfileType.title'),
                    subtitle: '',
                },
            }),
        );
    };

    const handleUpdateProfile = (profile: AthleteProfile) => {
        const isAthletics = profile.sport === SportProfileType.ATHLETICS;
        const isSwimming = profile.sport === SportProfileType.SWIMMING;
        const isTennis = profile.sport === SportProfileType.TENNIS;
        const isTrackEvent = profile.eventType === EventType.TRACK_EVENTS;
        const isFieldEvent = profile.eventType === EventType.FIELD_EVENTS;
        const isCombinedEvent = profile.eventType === EventType.COMBINED_EVENTS;
        const isRoadRunningEvent = profile.eventType === EventType.ROAD_RUNNING_EVENTS;
        const isIndividualSwimming = profile.eventType === EventType.INDIVIDUAL_EVENTS;
        const isRelaySwimming = profile.eventType === EventType.RELAY_EVENTS;
        const isOpenWaterSwimming = profile.eventType === EventType.OPEN_WATER_SWIMMING;

        dispatch(
            setCurrentProfile({
                currentProfile: profile,
            }),
        );

        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editSportProfileType',
                    title: trans('form.editSportProfileType.title'),
                    subtitle: '',
                    defaults: {
                        status: valueToSelectOption(
                            profile.status,
                            AthleteStatus,
                            trans,
                            'global.',
                        ),
                        sport: valueToSelectOption(
                            profile.sport,
                            SportProfileType,
                            trans,
                            'sport.',
                        ),
                        eventType: valueToSelectOption(
                            profile.eventType,
                            EventType,
                            trans,
                            'sport.eventType.',
                        ),
                        ...(isAthletics
                            ? {
                                  ...(isTrackEvent && {
                                      sprint: profile.sprint || [],
                                      middleDistance: profile.middleDistance || [],
                                      longDistance: profile.longDistance || [],
                                      hurdles: profile.hurdles || [],
                                      relay: profile.relay || [],
                                      steeplechase: profile.steeplechase || [],
                                  }),
                                  ...(isFieldEvent && {
                                      jumps: profile.jumps || [],
                                      throws: profile.throws || [],
                                  }),
                                  ...(isCombinedEvent && {
                                      heptathlon: profile.heptathlon || [],
                                      decathlon: profile.decathlon || [],
                                  }),
                                  ...(isRoadRunningEvent && {
                                      five_kilometers: profile.five_kilometers || [],
                                      ten_kilometers: profile.ten_kilometers || [],
                                      half_marathon: profile.half_marathon || [],
                                      marathon: profile.marathon || [],
                                  }),
                              }
                            : isSwimming
                              ? {
                                    ...(isIndividualSwimming && {
                                        freestyle: profile.freestyle || [],
                                        backstroke: profile.backstroke || [],
                                        breaststroke: profile.breaststroke || [],
                                        butterfly: profile.butterfly || [],
                                        im: profile.im || [],
                                    }),
                                    ...(isRelaySwimming && {
                                        freestyleRelay: profile.freestyleRelay || [],
                                        medleyRelay: profile.medleyRelay || [],
                                    }),
                                    ...(isOpenWaterSwimming && {
                                        openWaterSwimming: profile.openWaterSwimming || [],
                                    }),
                                }
                              : isTennis
                                ? {
                                      squad: profile.squad || [],
                                  }
                                : {
                                      hand: valueToSelectOption(
                                          profile.hand,
                                          HandStatus,
                                          trans,
                                          'global.',
                                      ),
                                      foot: valueToSelectOption(
                                          profile.foot,
                                          HandStatus,
                                          trans,
                                          'global.',
                                      ),
                                      position: valueToSelectOption(
                                          profile.position,
                                          DefaultPosition,
                                          trans,
                                          'global.',
                                      ),
                                  }),
                    },
                },
            }),
        );
    };

    const cards = profiles?.map((profile) => {
        const isAthletics = profile.sport === SportProfileType.ATHLETICS;
        const isSwimming = profile.sport === SportProfileType.SWIMMING;
        const isTennis = profile.sport === SportProfileType.TENNIS;
        const status = {
            isActive: profile.status === AthleteStatus.ACTIVE,
            label: trans(`global.${profile.status.toLowerCase()}`),
        };

        const items = [
            {
                title: trans('adminProfile'),
                value: trans(`sport.${profile.sport}`, profile.sport),
                imageSrc: '/assets/icons/cards/profile.svg',
            },
            ...(isAthletics
                ? [
                      ...(profile.eventType === EventType.TRACK_EVENTS
                          ? [
                                {
                                    title: trans('profileColumnName.sprint'),
                                    value:
                                        profile.sprint
                                            ?.map((item) => trans(`sport.sprints.${item}`))
                                            .join(', ') || trans('g.nodata'),
                                },
                                {
                                    title: trans('profileColumnName.middleDistance'),
                                    value:
                                        profile.middleDistance
                                            ?.map((item) => trans(`sport.middleDistance.${item}`))
                                            .join(', ') || trans('g.nodata'),
                                },
                            ]
                          : []),
                      ...(profile.eventType === EventType.FIELD_EVENTS
                          ? [
                                {
                                    title: trans('profileColumnName.jumps'),
                                    value:
                                        profile.jumps
                                            ?.map((item) => trans(`sport.jumps.${item}`))
                                            .join(', ') || trans('g.nodata'),
                                },
                                {
                                    title: trans('profileColumnName.throws'),
                                    value:
                                        profile.throws
                                            ?.map((item) => trans(`sport.throws.${item}`))
                                            .join(', ') || trans('g.nodata'),
                                },
                            ]
                          : []),
                      ...(profile.eventType === EventType.COMBINED_EVENTS
                          ? [
                                {
                                    title: trans('profileColumnName.heptathlon'),
                                    value:
                                        profile.heptathlon
                                            ?.map((item) => trans(`sport.combinedEvents.${item}`))
                                            .join(', ') || trans('g.nodata'),
                                },
                                {
                                    title: trans('profileColumnName.decathlon'),
                                    value:
                                        profile.decathlon
                                            ?.map((item) => trans(`sport.combinedEvents.${item}`))
                                            .join(', ') || trans('g.nodata'),
                                },
                            ]
                          : []),
                      ...(profile.eventType === EventType.ROAD_RUNNING_EVENTS
                          ? [
                                {
                                    title: trans('profileColumnName.five_kilometers'),
                                    value:
                                        profile.five_kilometers
                                            ?.map((item) =>
                                                trans(`sport.roadRunningEvents.${item}`),
                                            )
                                            .join(', ') || trans('g.nodata'),
                                },
                                {
                                    title: trans('profileColumnName.ten_kilometers'),
                                    value:
                                        profile.ten_kilometers
                                            ?.map((item) =>
                                                trans(`sport.roadRunningEvents.${item}`),
                                            )
                                            .join(', ') || trans('g.nodata'),
                                },
                                {
                                    title: trans('profileColumnName.half_marathon'),
                                    value:
                                        profile.half_marathon
                                            ?.map((item) =>
                                                trans(`sport.roadRunningEvents.${item}`),
                                            )
                                            .join(', ') || trans('g.nodata'),
                                },
                                {
                                    title: trans('profileColumnName.marathon'),
                                    value:
                                        profile.marathon
                                            ?.map((item) =>
                                                trans(`sport.roadRunningEvents.${item}`),
                                            )
                                            .join(', ') || trans('g.nodata'),
                                },
                            ]
                          : []),
                  ]
                : isSwimming
                  ? [
                        ...(profile.eventType === EventType.INDIVIDUAL_EVENTS
                            ? [
                                  {
                                      title: trans('profileColumnName.freestyle'),
                                      value:
                                          profile.freestyle
                                              ?.map((item) => trans(`sport.freestyle.${item}`))
                                              .join(', ') || trans('g.nodata'),
                                  },
                                  {
                                      title: trans('profileColumnName.backstroke'),
                                      value:
                                          profile.backstroke
                                              ?.map((item) => trans(`sport.backstroke.${item}`))
                                              .join(', ') || trans('g.nodata'),
                                  },
                                  //   {
                                  //       title: trans('profileColumnName.breaststroke'),
                                  //       value:
                                  //           profile.breaststroke
                                  //               ?.map((item) => trans(`sport.breaststroke.${item}`))
                                  //               .join(', ') || trans('g.nodata'),
                                  //   },
                                  //   {
                                  //       title: trans('profileColumnName.butterfly'),
                                  //       value:
                                  //           profile.butterfly
                                  //               ?.map((item) => trans(`sport.butterfly.${item}`))
                                  //               .join(', ') || trans('g.nodata'),
                                  //   },
                                  //   {
                                  //       title: trans('profileColumnName.im'),
                                  //       value:
                                  //           profile.im
                                  //               ?.map((item) => trans(`sport.im.${item}`))
                                  //               .join(', ') || trans('g.nodata'),
                                  //   },
                              ]
                            : []),
                        ...(profile.eventType === EventType.RELAY_EVENTS
                            ? [
                                  {
                                      title: trans('profileColumnName.freestyleRelay'),
                                      value:
                                          profile.freestyleRelay
                                              ?.map((item) =>
                                                  trans(`sport.relayEvents.freestyleRelay.${item}`),
                                              )
                                              .join(', ') || trans('g.nodata'),
                                  },
                                  {
                                      title: trans('profileColumnName.medleyRelay'),
                                      value:
                                          profile.medleyRelay
                                              ?.map((item) =>
                                                  trans(`sport.relayEvents.medleyRelay.${item}`),
                                              )
                                              .join(', ') || trans('g.nodata'),
                                  },
                              ]
                            : []),
                        ...(profile.eventType === EventType.OPEN_WATER_SWIMMING
                            ? [
                                  {
                                      title: trans('profileColumnName.openWaterSwimming'),
                                      value:
                                          profile.openWaterSwimming
                                              ?.map((item) =>
                                                  trans(`sport.openWaterSwimming.${item}`),
                                              )
                                              .join(', ') || trans('g.nodata'),
                                  },
                              ]
                            : []),
                    ]
                  : isTennis
                    ? [
                          {
                              title: trans('profileColumnName.squad'),
                              value:
                                  profile.squad
                                      ?.map((item) => trans(`sport.squad.${item}`))
                                      .join(', ') || trans('g.nodata'),
                          },
                      ]
                    : [
                          {
                              title: trans('form.editAthleteDetails.position'),
                              value: trans(`global.${profile.position}`, {
                                  defaultValue: profile.position,
                              }),
                              imageSrc: '/assets/icons/cards/position.svg',
                          },
                          {
                              title: trans('form.editAthleteDetails.hand'),
                              value: trans(`global.${profile.hand}`, {
                                  defaultValue: profile.hand,
                              }),
                              imageSrc: '/assets/icons/cards/hand.svg',
                          },
                          {
                              title: trans('form.editAthleteDetails.foot'),
                              value: trans(`global.${profile.foot}`, {
                                  defaultValue: profile.foot,
                              }),
                              imageSrc: '/assets/icons/cards/foot.svg',
                          },
                      ]),

            {
                title: trans('form.editAthleteDetails.status'),
                value: <StatusIndicator isActive={status.isActive} />,
                imageSrc: '/assets/icons/cards/status.svg',
            },
        ];

        return (
            <Card key={profile.id} items={items} onUpdate={() => handleUpdateProfile(profile)} />
        );
    });

    return (
        <Theme.Section>
            {/* <Theme.Header className="flex w-full"> */}
            <Theme.ButtonWrapper>
                <Theme.TitleRes variant="h2" value={trans('athlete.profiles')} />
                <WithRole blockRoles={[UserRole.COACH]}>
                    <Theme.ButtonRes onClick={handleAddProfile} $isTable={true}>
                        {trans('athlete.profiles.add')}
                    </Theme.ButtonRes>
                </WithRole>
            </Theme.ButtonWrapper>
            {/* </Theme.Header> */}

            {cards.length > 0 ? (
                <Theme.CardWrapper>{cards}</Theme.CardWrapper>
            ) : (
                <Theme.EmptyMessage>
                    <img src="/assets/icons/clock.svg" alt="No information" />
                    <p>{trans('g.nodata')}</p>
                </Theme.EmptyMessage>
            )}
        </Theme.Section>
    );
};
