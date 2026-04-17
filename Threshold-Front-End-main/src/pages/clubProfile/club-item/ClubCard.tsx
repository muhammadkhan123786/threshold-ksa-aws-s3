import { SharedButton } from 'components/sharedButton';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import _ from 'lodash';
import { router } from 'routers';

export const ClubCard = ({ club }: any) => {
    const { isRTL, trans } = useLocales();
    const { name, avatar, metrics, mainManagers } = club;

    // Navigation Functions
    const redirectTeams = (sportId: string) => {
        router.navigate('teams', { sportId });
    };

    const redirectCoaches = (sportId: string) => {
        router.navigate('coaches', { sportId });
    };

    const redirectAdministrators = (sportId: string) => {
        router.navigate('administrator', { sportId });
    };

    const redirectPlayers = (sportId: string) => {
        router.navigate('players', { sportId });
    };

    const redirectOverview = (sportId: string) => {
        router.navigate('overview', { sportId });
    };

    return (
        <Theme.Card>
            <Theme.AvatarSection>
                <Theme.Avatar>
                    <img
                        src={avatar || '/default-avatar.png'}
                        alt=""
                        style={{ width: '60%', height: '60%' }}
                    />
                </Theme.Avatar>
                <Theme.Title>{name}</Theme.Title>
            </Theme.AvatarSection>

            <Theme.DetailsSection>
                <Theme.Metrics>
                    <Theme.MetricItem onClick={() => redirectTeams(club?.id)}>
                        <Theme.MetricValue>{metrics.teams}</Theme.MetricValue>
                        <Theme.MetricLabel>{trans('clubCard.metrics.teams')}</Theme.MetricLabel>
                    </Theme.MetricItem>

                    <Theme.MetricItem onClick={() => redirectCoaches(club?.id)}>
                        <Theme.MetricValue>{metrics.coaches}</Theme.MetricValue>
                        <Theme.MetricLabel>{trans('clubCard.metrics.coaches')}</Theme.MetricLabel>
                    </Theme.MetricItem>

                    <Theme.MetricItem onClick={() => redirectAdministrators(club?.id)}>
                        <Theme.MetricValue>{metrics.administrators}</Theme.MetricValue>
                        <Theme.MetricLabel>
                            {trans('clubCard.metrics.administrators')}
                        </Theme.MetricLabel>
                    </Theme.MetricItem>

                    <Theme.MetricItem onClick={() => redirectPlayers(club?.id)}>
                        <Theme.MetricValue>{metrics.athletes}</Theme.MetricValue>
                        <Theme.MetricLabel>{trans('clubCard.metrics.athletes')}</Theme.MetricLabel>
                    </Theme.MetricItem>
                </Theme.Metrics>

                {mainManagers && mainManagers.length > 0 && (
                    <Theme.ManagersSection className="flex">
                        {mainManagers.map((manager: any) => (
                            <Theme.ManagerItem key={manager.id}>
                                <Theme.Managername className="capitalize font-bold">
                                    {manager.firstName} {manager.lastName}
                                </Theme.Managername>
                                {manager.user?.role && (
                                    <Theme.Managerrole className="capitalize">
                                        {trans(`roles.${manager.user.role}`)}
                                    </Theme.Managerrole>
                                )}
                            </Theme.ManagerItem>
                        ))}
                    </Theme.ManagersSection>
                )}
            </Theme.DetailsSection>
            <div>
                <SharedButton
                    style={{
                        marginTop: '0px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    variant={'secondary'}
                    onClick={() => redirectOverview(club?.id)}
                >
                    {trans('view.profile')}
                </SharedButton>
                <Theme.ButtonPrimary
                    style={{
                        marginTop: '20px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                    }}
                    onClick={() => console.log('click')}
                >
                    {trans('club.space')}
                    {isRTL ? (
                        <Theme.Icon
                            src="/assets/icons/left-arrow.svg"
                            height={16}
                            width={16}
                            alt="left Icon"
                        />
                    ) : (
                        <Theme.Icon
                            src="/assets/icons/next-icon.svg"
                            height={16}
                            width={16}
                            alt="right Icon"
                        />
                    )}
                </Theme.ButtonPrimary>
            </div>
        </Theme.Card>
    );
};
