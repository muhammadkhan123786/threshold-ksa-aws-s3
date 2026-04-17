import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';

export const Tasks = () => {
    const { trans } = useLocales();
    return (
        <Theme.Body>
            <p>{trans('notification.notAvailable')}</p>
        </Theme.Body>
    );
};
