import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFormContext } from 'react-hook-form';

const UserData = () => {
    const { trans } = useLocales();
    const { control } = useFormContext();

    return (
        <>
            <Theme.InputController
                type="text"
                autoComplete="username"
                {...{
                    control,
                    name: 'username',
                    label: trans('signup.fullName'),
                    placeholder: trans('signup.fullNamePlaceholder'),
                }}
            />
            <Theme.InputController
                type="text"
                autoComplete="email"
                {...{
                    control,
                    name: 'email',
                    label: trans('signup.adminEmail'),
                    placeholder: trans('signup.adminEmailPlaceholder'),
                }}
            />
            <Theme.InputController
                type="password"
                autoComplete="password"
                {...{
                    control,
                    name: 'password',
                    label: trans('signup.password'),
                    placeholder: trans('signup.passwordPlaceholder'),
                }}
            />
        </>
    );
};

export default UserData;
