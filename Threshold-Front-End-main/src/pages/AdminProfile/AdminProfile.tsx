import { router } from 'routers';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useDispatch, useSelector } from 'react-redux';
import { authSlice, selectAuth } from 'store/authSlice';
import { getAvatarPlaceholder } from 'libs/constants';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEditAdminAvatarSchema } from 'schemas';
import PersonalInfo from './PersonalInfo';
import GeneralInfo from './GeneralInfo';
import { useGetUsers } from 'hooks/data';
import { User } from 'libs/types';
import { selectControls } from 'store';
import { InputFileController, Loader } from 'components';
import { handleEditUser } from 'libs/helpers';
import styled from 'styled-components';
import { useMediaQuery } from 'hooks/mediaQuery';

export const AdminProfile = () => {
    const { trans } = useLocales();
    const { entities } = useSelector(selectAuth);
    const { modalContent } = useSelector(selectControls);
    const {
        params: { id },
    } = router.getState();
    const { data: user, isLoading } = useGetUsers<User>({
        id,
        idType: 'user',
        dependents: [modalContent],
    });
    const dispatch = useDispatch();
    const editAdminAvatarSchema = useEditAdminAvatarSchema();
    const {
        formState: { isValid },
        control,
        trigger,
        getValues,
        reset,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editAdminAvatarSchema as any),
    });

    const handleClick = async () => {
        if (entities?.userId) {
            if (getValues('avatar'))
                dispatch(authSlice.actions.setAvatarAction(getValues('avatar')));
            await handleEditUser(getValues(), dispatch, entities.userId);
            reset({});
        }
    };

    if (isLoading) return <Loader />;

    return (
        <Theme.Body>
            <Theme.Wapper>
                <Theme.AvatarBox>
                    <h2 className="font-bold text-[25px]">{trans('profile.avatarTitle')}</h2>

                    <Theme.Avatar
                        src={getValues('avatar') || user?.avatar || getAvatarPlaceholder()}
                        alt="avatar"
                    />

                    <div className="font-[500] text-[20px]">{entities?.username}</div>

                    <InputFileController
                        {...{
                            control,
                            trigger,
                            isAvatar: false,
                            name: 'avatar',
                            contents: (
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText3')}
                                </Theme.UploadText>
                            ),
                        }}
                    />

                    <Theme.ChangeImageButton
                        style={{
                            color: '#c0d330',
                            border: '1px solid #c0d330',
                            backgroundColor: '#fff',
                            fontSize: '16px',
                        }}
                        disabled={!getValues('avatar')}
                        onClick={handleClick}
                    >
                        {trans('profile.changeImageButton')}
                    </Theme.ChangeImageButton>
                </Theme.AvatarBox>

                <PersonalInfo user={user} />
            </Theme.Wapper>

            <GeneralInfo user={user} />
        </Theme.Body>
    );
};
