import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import { SessionPlayingType, SessionRecord } from 'libs/types';
import { useGetSessionRecords, useGetSessions } from 'hooks/data';
import { closeModal, setBreadCrumps, setModalContent } from 'store/controlsSlice';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { formatDate } from 'hooks/locales/useLocales';
import { selectAcademy } from 'store';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditSessionSchema } from 'schemas/team/editSession';
import { useForm, FormProvider } from 'react-hook-form';
import { SessionItem } from './components/otherSport';
import { SwimmingSessionItem } from './components/swimming';

import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { useEffect } from 'react';
import { sessionAPIs } from 'services/apis';
import { arrayToSelectOptions } from 'libs/helpers';
import { ActiveTab, PlayingSessionStatus, PlayingSessionType, SportProfileType } from 'libs/enums';
import { MultiSelectController } from 'components';
import { omit } from 'lodash';
import { WithSport } from 'hooks/sport';
import { AthleticsSessionItem } from './components/athletics/SesstionItem';
import { PreparationComplete } from './components/preparationComplete';
import { useCreateSession } from 'schemas/team/createSession';

export const SessionUpdatePage = () => {
    const router = useRouter();

    const {
        params: { id },
    } = router.getState();

    const { academy, currentTeam } = useSelector(selectAcademy);

    const session = useGetSessions<SessionPlayingType>({
        id,
        idType: 'session',
    });

    const sportType = session?.team?.sport as SportProfileType;
    const sessionType = session?.type as PlayingSessionType;
    const sessionStatus = session?.status as PlayingSessionStatus;

    const addSessionSchema = useCreateSession(currentTeam?.athletes ?? [], {
        sportType,
        sessionType,
        sessionStatus,
    });

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(addSessionSchema),
    });

    const sessionRecords = useGetSessionRecords<SessionRecord[]>({
        id,
        idType: 'session',
        dependents: [id],
    });

    const dispatch = useDispatch<any>();

    const { trans, isFutureDateSelected } = useLocales();

    const isFutureDate = isFutureDateSelected(session?.date);

    const handleSave = async () => {
        const teamId = session.team?.id;
        const sessionId = session.id;

        try {
            if (teamId && academy?.id) {
                const formData = methods.getValues() as any;

                const sessionRecords = Object.entries(omit(formData, ['session'])).map(
                    ([athleteId, record]: any) => {
                        return {
                            id: record.id,
                            athlete: athleteId,
                            status: record.status,
                            comment: record.comment,
                            scale: record.scale,
                        };
                    },
                );

                const sessionData = {
                    id: sessionId,
                    academy: academy?.id,
                    team: teamId,
                    date: session.date,
                    type: session.type,
                    from: session.from,
                    to: session.to,
                    status: formData.session.status?.value,
                    sessionRecords: sessionRecords,
                };

                const response = await dispatch(sessionAPIs.saveSession(sessionId)(sessionData));

                const isSuccess = [200, 201].includes(response?.payload?.status);
                if (isSuccess) {
                    dispatch(
                        setModalContent({
                            modalContent: {
                                type: isSuccess ? 'success' : 'warning',
                                title: isSuccess ? 'Success' : 'Warning',
                                subtitle: isSuccess
                                    ? 'Session data have been updated'
                                    : 'Some updates failed. Please try again.',
                                redirect: {
                                    path: `team`,
                                    id: teamId,
                                    condition: isSuccess,
                                },
                            },
                        }),
                    );
                }
            }
        } catch (error: any) {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Error occurred',
                        subtitle: error.message,
                    },
                }),
            );
        }
    };

    const handleCancel = async () => {
        dispatch(
            setBreadCrumps({
                breadCrumps: [
                    ActiveTab.TEAM_LIST,
                    'Team Details',
                    `${trans('session.header')} - ${formatDate(session?.date, 'YYYY-MM-DD')}`,
                ],
            }),
        );

        router.navigate('team-session', { id: session.id });
    };

    useEffect(() => {
        if (sessionRecords?.length || session) {
            const defaultValues = sessionRecords?.reduce?.((values: any, record) => {
                const id = record?.athlete?.id || '';
                values[id] = record;
                return values;
            }, {});
            methods.reset({
                ...defaultValues,
                session: {
                    status: {
                        value: session?.status,
                        label: trans(`session.${session?.status}`),
                    },
                },
            });
            // methods.trigger();
        }
    }, [sessionRecords, session]);

    return (
        <Theme.Body>
            dasdasE EAWE AWE A
            <Theme.AvatarSection>
                <Theme.Avatar
                    src={session?.team?.logo || '/assets/images/logo-placeholder.jpg'}
                    alt="avatar"
                />
                <Theme.Name variant="h3" value={session?.team?.name || ''} />
            </Theme.AvatarSection>
            <Theme.SessionTitleSection className="mr-auto text-[18px] uppercase font-bold flex flex-wrap">
                <Theme.SessionTitle>
                    {`${trans('session.header')} - ${formatDate(session?.date || '')}`}
                </Theme.SessionTitle>
            </Theme.SessionTitleSection>
            <Theme.CardList>
                {isFutureDate ? (
                    <Theme.Alert role="alert">
                        <Theme.AlertStrong>{trans('session.alert.notice')}</Theme.AlertStrong>
                        {' : '}
                        {trans('session.alert.message')}
                    </Theme.Alert>
                ) : (
                    <FormProvider {...{ ...methods }}>
                        {currentTeam?.athletes?.map?.(({ id, avatar, firstName, lastName }) => (
                            <WithSport
                                key={id}
                                allowSports={[
                                    SportProfileType.SWIMMING,
                                    SportProfileType.ATHLETICS,
                                ]}
                                elseIf={
                                    <SessionItem
                                        avatar={avatar}
                                        firstName={firstName}
                                        lastName={lastName}
                                        id={id}
                                    />
                                }
                                sportType={session?.team?.sport}
                            >
                                <WithSport
                                    sessionStatus={session?.status}
                                    beforeStatus={PlayingSessionStatus.PREPARATION_COMPLETE}
                                    elseIf={
                                        <>
                                            <WithSport
                                                allowSports={[SportProfileType.SWIMMING]}
                                                sportType={session?.team?.sport}
                                            >
                                                <SwimmingSessionItem
                                                    key={id}
                                                    avatar={avatar}
                                                    firstName={firstName}
                                                    lastName={lastName}
                                                    id={id}
                                                />
                                            </WithSport>
                                            <WithSport
                                                allowSports={[SportProfileType.ATHLETICS]}
                                                sportType={session?.team?.sport}
                                            >
                                                <AthleticsSessionItem
                                                    key={id}
                                                    avatar={avatar}
                                                    firstName={firstName}
                                                    lastName={lastName}
                                                    id={id}
                                                />
                                            </WithSport>
                                        </>
                                    }
                                >
                                    <PreparationComplete
                                        avatar={avatar}
                                        firstName={firstName}
                                        lastName={lastName}
                                        id={id}
                                    />
                                </WithSport>
                            </WithSport>
                        ))}
                    </FormProvider>
                )}
            </Theme.CardList>
            <Theme.Section>
                <Theme.TitleSection>{trans('session.status')}</Theme.TitleSection>
                <Theme.FieldSection>
                    <MultiSelectController
                        {...{
                            control: methods.control,
                            name: 'session.status',
                            options: arrayToSelectOptions({ array: PlayingSessionStatus }),
                            transSuffix: 'session.',
                            menuPlacement: 'bottom',
                        }}
                    />
                </Theme.FieldSection>
            </Theme.Section>
            {!isFutureDate && (
                <Theme.Footer>
                    <ButtonsControls
                        handleSave={methods.handleSubmit(handleSave)}
                        handleCancel={handleCancel}
                        // isValid={methods.formState.isValid}
                    />
                </Theme.Footer>
            )}
        </Theme.Body>
    );
};
