import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { fireAlert } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';

import { useState } from 'react';
import { router } from 'routers';
import { StoreState } from 'libs/types';
import { FeedbackType } from 'services/hooks/feedback/useGetFeedbackClub';
import { usePostFeedbackClub } from 'services/hooks/feedback/useGetFeedbackClub';
import { RadioGroupInput } from 'components/RadioGroupInput';
import { FilePickerController, InputController } from 'components';
import { FormRow } from 'components/modal-windows/FormRow';
import { SharedButton } from 'components/sharedButton';
import { useSendFeedbackClubMessageSchema } from 'schemas/app/sendFeedbackClubMessage.schema';
import { switchActiveTab } from 'store/controlsSlice';

export const ContactUs = () => {
    const user = useSelector((state: StoreState) => state.auth?.entities);
    const { trans } = useLocales();
    const [isSuccess, setIsSuccess] = useState(false);
    const dispatch = useDispatch();
    const sendMessageSchema = useSendFeedbackClubMessageSchema();
    const {
        formState: { isValid, errors },
        control,
        handleSubmit,
        watch,
        reset,
    } = useForm<any>({
        mode: 'all',
        resolver: yupResolver(sendMessageSchema) as any,
    });

    const { mutate: postFeedback, isPending } = usePostFeedbackClub({
        onSuccess: () => {
            setIsSuccess(true);
            reset();
        },
        onError: (error) => {
            fireAlert(
                {
                    type: 'warning',
                    title: trans('messages.error.feedbackFailed'),
                    subtitle: error.message || trans('messages.error.feedbackFailed'),
                },
                dispatch,
            );
        },
    });
    const handleSend = (adata: {
        message: string;
        type: FeedbackType;
        avatar: File;
        subject: string;
    }) => {
        postFeedback({
            message: adata.message,
            type: adata.type,
            avatar: adata.avatar,
            subject: adata.subject,
        });
    };
    const handleBackHome = () => {
        dispatch(switchActiveTab({ activeTab: 'dashboard' }));
        router.navigate('home', { replace: true });
    };

    return (
        <>
            {!isSuccess ? (
                <Theme.Body onSubmit={handleSubmit(handleSend)}>
                    <form>
                        <Theme.TitleWrapper>
                            <Theme.TitlePara>{trans('text.welcome')},</Theme.TitlePara>
                            <Theme.TitleSpan>{user?.username}</Theme.TitleSpan>
                            <p>{`${trans('contactMessage')} {${user?.email}}.`}</p>
                            <Theme.FormWrapper>
                                <FormRow
                                    style={{
                                        fontSize: '14px',
                                        color: '#777777',
                                        display: 'block',
                                    }}
                                    content={
                                        <RadioGroupInput
                                            label={trans('label.type')}
                                            name="type"
                                            control={control}
                                            options={[
                                                {
                                                    value: FeedbackType.ISSUE,
                                                    label: trans('label.issue'),
                                                },
                                                {
                                                    value: FeedbackType.REQUEST,
                                                    label: trans('label.request'),
                                                },
                                                {
                                                    value: FeedbackType.SUGGESTION,
                                                    label: trans('label.suggestion'),
                                                },
                                                {
                                                    value: FeedbackType.OTHER,
                                                    label: trans('label.other'),
                                                },
                                            ]}
                                        />
                                    }
                                />
                                <FormRow
                                    style={{
                                        fontSize: '14px',
                                        color: '#777777',
                                        display: 'block',
                                    }}
                                    content={
                                        <InputController
                                            {...{
                                                control,
                                                name: 'subject',
                                                label: trans('home.contacts.subject'),
                                                placeholder: trans(
                                                    'home.contacts.subject.placeholder',
                                                ),
                                            }}
                                        />
                                    }
                                />
                                <FormRow
                                    style={{
                                        fontSize: '14px',
                                        color: '#777777',
                                        display: 'block',
                                    }}
                                    content={
                                        <InputController
                                            {...{
                                                control,
                                                name: 'notes',
                                                label: trans('home.contacts.message'),
                                                placeholder: trans(
                                                    'home.contacts.message.placeholder',
                                                ),
                                            }}
                                            isMultiline={true}
                                            rows={2}
                                        />
                                    }
                                />
                                <FormRow
                                    style={{
                                        fontSize: '14px',
                                        color: '#777777',
                                        display: 'block',
                                    }}
                                    title={trans('home.contacts.media')}
                                    content={
                                        <FilePickerController
                                            {...{
                                                control,
                                                name: 'avatar',
                                                placeholder: trans('home.contacts.media'),
                                                accept: 'image/*',
                                                maxFiles: 1,
                                            }}
                                        />
                                    }
                                />
                            </Theme.FormWrapper>
                            <Theme.ButtonWrapper>
                                <SharedButton
                                    type="submit"
                                    loading={isPending}
                                    onClick={handleSubmit(handleSend)}
                                >
                                    {trans('home.contacts.sendMessage')}
                                </SharedButton>
                            </Theme.ButtonWrapper>
                        </Theme.TitleWrapper>
                    </form>
                </Theme.Body>
            ) : (
                <Theme.SuccessSentWrapper>
                    <Theme.Image src="/assets/images/success-sent.svg" alt="sent email" />
                    <Theme.Logo src={'/assets/icons/logo.svg'} alt="logo" />
                    <Theme.HeadTitle>{trans('home.contacts.success.header')}</Theme.HeadTitle>
                    <Theme.SubTitle>{`${trans(
                        'home.contacts.success.subTitle',
                    )} {${user?.email}}.`}</Theme.SubTitle>
                    <SharedButton type="submit" onClick={handleBackHome}>
                        {trans('home.contacts.success.back')}
                    </SharedButton>
                </Theme.SuccessSentWrapper>
            )}
        </>
    );
};
