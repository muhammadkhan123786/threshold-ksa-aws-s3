import { router } from 'routers';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, setAuthData } from 'store/authSlice';
import { MultiSelectController } from 'components';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditAdminGeneralInfoSchema } from 'schemas';
import { arrayToSelectOptions, fireAlert, selectOptionsToValues } from 'libs/helpers';
import { Language } from 'libs/enums';
import { User } from 'libs/types';
import { useEffect } from 'react';
import { authAPIs } from 'services/apis';
import { setLang } from 'store/localesSlice';

const GeneralInfo = ({ user }: { user: User }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const {
        params: { id },
    } = router.getState();

    const editAdminGeneralInfoSchema = useEditAdminGeneralInfoSchema();
    const { control, setValue, getValues } = useForm({
        mode: 'all',
        resolver: yupResolver(editAdminGeneralInfoSchema),
    });

    useEffect(() => {
        if (user) {
            setValue('language', {
                label: trans(`language.${user.language || ''}`),
                value: user.language || '',
            });
            setValue('notification', !!user?.notification);
        }
    }, [user]);

    const handleClick = async () => {
        const formData = selectOptionsToValues(getValues(), ['language']);
        const response = await dispatch(authAPIs.updateUser(id)(formData));

        const isSuccess = [201, 200].includes(response?.payload?.status);

        if (isSuccess) {
            dispatch(setLang(formData.language));
        }
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
        <Theme.GeneralInfoBox>
            <h2 className="font-bold text-[25px]">{trans('profile.generalInformation')}</h2>

            <div className="font-bold">{trans('profile.language')}</div>

            <MultiSelectController
                {...{
                    control,
                    name: 'language',
                    options: arrayToSelectOptions({ array: Language }),
                    transSuffix: 'language.',
                    menuPlacement: 'bottom',
                }}
            />

            {/* <div className="font-bold">{trans('profile.notificationPermission')}</div>

            <CheckboxController
                {...{
                    control,
                    name: 'notification',
                    label: trans('profile.receiveNotifications'),
                    defaultValue: true,
                }}
            /> */}

            <Theme.SaveButton
                className="w-fit"
                type="button"
                style={{ marginLeft: 'auto' }}
                onClick={handleClick}
            >
                {trans('profile.save')}
            </Theme.SaveButton>
        </Theme.GeneralInfoBox>
    );
};

export default GeneralInfo;
