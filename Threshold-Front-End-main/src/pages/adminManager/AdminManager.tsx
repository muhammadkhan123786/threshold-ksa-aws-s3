import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectControls } from 'store';
import { Coach, Team } from 'libs/types';
import { useGetCoaches, useGetTeams } from 'hooks/data';
import { getAvatarPlaceholder } from 'libs/constants';
import { CoachPersonalInfoTable, TeamsTable } from 'components/tables';
import { setModalContent } from 'store/controlsSlice';
import { Loader } from 'components';

export const AdminManagerPage = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const router = useRouter();
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();

    const { data: coach, isLoading } = useGetCoaches<Coach>({
        id,
        idType: 'coach',
        dependents: [modalContent],
    });
    const { data: teams } = useGetTeams<Team[]>({
        id,
        idType: 'coach',
        dependents: [modalContent],
    });

    const handleEditProfile = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editCoachProfile',
                    title: trans('form.editCoachProfile.title'),
                    subtitle: trans('form.editCoachProfile.subtitle'),
                    defaults: {
                        firstName: coach.firstName,
                        lastName: coach.lastName,
                        avatar: coach.avatar,
                    },
                },
            }),
        );
    };

    if (isLoading) return <Loader />;
    return (
        <Theme.CoachBody>
            <Theme.AvatarSection>
                <Theme.Avatar
                    src={coach?.avatar || getAvatarPlaceholder(coach?.gender)}
                    alt="avatar"
                />

                <Theme.Name variant="h3" value={`${coach?.firstName} ${coach?.lastName}`} />

                <Theme.Button onClick={handleEditProfile}>
                    {trans('coach.editProfile')}
                </Theme.Button>
            </Theme.AvatarSection>

            <CoachPersonalInfoTable coach={coach} />

            <div className="flex flex-col w-full">
                <SharedTheme.Title variant="h2" value={trans('coach.teams')} />

                <SharedTheme.TableContainer>
                    <TeamsTable teams={teams} />
                </SharedTheme.TableContainer>
            </div>
        </Theme.CoachBody>
    );
};
