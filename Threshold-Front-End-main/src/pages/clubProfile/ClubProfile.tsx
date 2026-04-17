import { ClubInfo } from './club-info/ClubInfo';
import * as Theme from './Theme';
import { ClubList } from './club-list/ClubList';

export const ClubProfile = () => {
    return (
        <Theme.Body>
            <ClubInfo />
            <ClubList />
        </Theme.Body>
    );
};
