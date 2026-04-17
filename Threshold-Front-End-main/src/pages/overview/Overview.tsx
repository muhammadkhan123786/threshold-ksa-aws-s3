import * as Theme from './Theme';
import { AdministratorOverview } from 'components/administratorOverview';
import { SportProfileManagerOverview } from 'components/sportProfileManagerOverview';
import { CoachOverview } from 'components/coachOverview';
import { UserRole } from 'libs/enums';
import { WithRole } from 'hooks/roles';

export const Overview = () => {
    return (
        <Theme.Body>
            <WithRole
                allowRoles={[
                    UserRole.CLUB_COACH_HEAD,
                    UserRole.CLUB_COACH_ASSISTANT,
                    UserRole.CLUB_COACH_TRAINER,
                    UserRole.CLUB_COACH_ANALYST,
                ]}
            >
                <CoachOverview />
            </WithRole>
            <WithRole
                allowRoles={[
                    UserRole.CLUB_EXECUTIVE_MANAGER,
                    UserRole.CLUB_TECHNICAL_DIRECTOR,
                    UserRole.CLUB_SPORT_PROFILE_MANAGER,
                ]}
            >
                <SportProfileManagerOverview />
            </WithRole>
            <WithRole allowRoles={[UserRole.CLUB_ADMIN]}>
                <AdministratorOverview />
            </WithRole>
        </Theme.Body>
    );
};
