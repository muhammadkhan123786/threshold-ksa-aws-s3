import { router } from 'routers';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setAuthData } from 'store/authSlice';
import { InputController } from 'components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditAdminPersonalInfoSchema } from 'schemas';
import { authAPIs } from 'services/apis';
import { fireAlert } from 'libs/helpers';
import { useGetUsers } from 'hooks/data';
import { User } from 'libs/types';
import { selectControls } from 'store';
import { useEffect } from 'react';

const PersonalInfo = ({ user }: { user: User }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const {
        params: { id },
    } = router.getState();

    const editAdminPersonalInfoSchema = useEditAdminPersonalInfoSchema();
    const {
        formState: { isValid, isDirty },
        control,
        getValues,
        setValue,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editAdminPersonalInfoSchema),
    });

    useEffect(() => {
        if (user) {
            setValue('username', user.username || '');
            setValue('email', user.email || '');
            setValue('phoneNumber', user.phoneNumber || '');
        }
    }, [user]);

    const handleClick = async () => {
        const response = await dispatch(authAPIs.updateUser(id)(getValues()));

        const isSuccess = [201, 200].includes(response?.payload?.status);

        fireAlert(
            {
                type: isSuccess ? 'success' : 'warning',
                title: isSuccess ? 'Success' : 'Warning',
                subtitle: isSuccess
                    ? 'Admin has been updated successfully'
                    : response?.payload?.payload?.message || 'Error occurred',
            },
            dispatch,
        );

        if (isSuccess) {
            dispatch(
                setAuthData({
                    ...getValues(),
                }),
            );
        }
    };

    return (
        <Theme.PersonalInfoBox>
            <h2 className="font-bold text-[25px]">{trans('profile.personalInformation')}</h2>

            <InputController
                {...{
                    control,
                    name: 'username',
                    label: trans('profile.name'),
                }}
            />

            <InputController
                {...{
                    control,
                    name: 'email',
                    label: trans('profile.email'),
                    defaultValue: user?.email || '',
                }}
            />

            <InputController
                {...{
                    control,
                    name: 'phoneNumber',
                    label: trans('profile.phone'),
                }}
            />

            <Theme.SaveButton
                className="w-fit"
                type="button"
                style={{ marginLeft: 'auto' }}
                onClick={handleClick}
                disabled={!isValid && !isDirty}
            >
                {trans('profile.save')}
            </Theme.SaveButton>
        </Theme.PersonalInfoBox>
    );
};

export default PersonalInfo;
