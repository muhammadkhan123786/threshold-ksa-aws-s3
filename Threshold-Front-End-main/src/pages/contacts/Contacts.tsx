import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSendMessageSchema } from 'schemas';
import { InputController } from 'components';
import { academyAPIs } from 'services/apis';
import { fireAlert } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';

export const Contacts = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { academy } = useSelector(selectAcademy);
    const sendMessageSchema = useSendMessageSchema();
    const {
        formState: { isValid },
        control,
        handleSubmit,
        setValue,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(sendMessageSchema),
    });

    function handleMakeCall() {
        window.location.href = 'tel:0558969495';
    }

    const handleSend = async (data: any) => {
        const response = await dispatch(
            academyAPIs.createFeedback()({ ...data, academy: academy?.id || '' }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        if (isSuccess) {
            fireAlert(
                {
                    type: isSuccess ? 'success' : 'warning',
                    title: isSuccess ? 'Success' : 'Warning',
                    subtitle: isSuccess
                        ? 'Feedback has been sent successfully'
                        : response?.payload?.payload?.payload || 'Error Occurred',
                },
                dispatch,
            );

            // setValue('name', '');
            // setValue('notes', '');
            // setValue('email', '');
        }
    };

    return (
        <Theme.Body onSubmit={handleSubmit(handleSend)}>
            <h1 className="text-[30px] font-bold text-center">{trans('home.contacts.title')}</h1>
            <div className="text-[20px] text-center">{trans('home.contacts.caption')}</div>
            <InputController
                {...{
                    control,
                    name: 'name',
                    label: trans('home.contacts.name'),
                }}
            />
            <InputController
                {...{
                    control,
                    name: 'email',
                    label: trans('home.contacts.email'),
                }}
            />
            <InputController
                {...{
                    control,
                    name: 'notes',
                    label: trans('home.contacts.notes'),
                }}
                isMultiline={true}
            />
            <Theme.SendButton type="submit" disabled={!isValid} onClick={handleSend}>
                {trans('home.contacts.submit')}
            </Theme.SendButton>
            {/* <Theme.OrTxtBody> {trans('home.contacts.or')}</Theme.OrTxtBody>
            <Theme.CallButton type="button" onClick={handleMakeCall}>
                {trans('home.contacts.call.us')}
            </Theme.CallButton> */}
        </Theme.Body>
    );
};
