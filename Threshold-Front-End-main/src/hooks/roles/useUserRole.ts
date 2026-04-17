import { selectUserRole } from 'hooks/pageStructure/selectors';
import { UserRole } from 'libs/enums';
import { useSelector } from 'react-redux';

export const useUserRole = () => {
    const userRole: UserRole | undefined = useSelector(selectUserRole);
    return userRole;
};
