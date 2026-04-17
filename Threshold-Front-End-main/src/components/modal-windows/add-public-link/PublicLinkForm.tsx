import React from 'react';
import { useLocales } from 'hooks/locales';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Body, Divider } from '../Theme';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import ButtonsControls from '../ButtonsControls';
import { InputController } from 'components/input';
import { InputDateController } from 'components/inputDate';
import { useCreatePublicAthleteLinkSchema } from 'schemas/links/createPublicAthleteLinkSchema';
import { useCreatePublicAthleteLink } from 'services/hooks';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import { router } from 'routers';
import { addMonths } from 'libs/helpers';
import { useGetPublicAthleteLink } from 'services/hooks';

export const PublicLinkForm: React.FC<
    FormWindowProps & FormControlsProps & React.HTMLAttributes<HTMLDivElement>
> = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const { refetch } = useGetPublicAthleteLink();

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        mode: 'all',
        resolver: yupResolver(useCreatePublicAthleteLinkSchema()),
    });

    const mutation = useCreatePublicAthleteLink();

    const handleSave = (formData: any) => {
        mutation.mutate(formData, {
            onSuccess: (data) => {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: 'Success',
                            subtitle: 'Athlete data has been updated',
                            redirect: {
                                path: 'home',
                                condition: true,
                            },
                        },
                    }),
                );

                refetch();
                router.navigate('signin', { replace: true });
            },
            onError: (error) => {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'warning',
                            title: 'Warning',
                            subtitle: error.message,
                            redirect: {
                                path: 'home',
                                condition: false,
                            },
                        },
                    }),
                );
            },
        });
    };

    return (
        <Body>
            <FormRow
                title={trans('form.createPublicAthleteLink.academy')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'academyId',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.createPublicAthleteLink.expirationDate')}
                content={
                    <InputDateController
                        {...{
                            control,
                            maxDate: addMonths(new Date(), 1),
                            minDate: new Date(),
                            name: 'expirationDate',
                            placeholder: trans(
                                'form.createPublicAthleteLink.expirationDatePlaceholder',
                            ),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.createPublicAthleteLink.limitNumber')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'limitNumber',
                            type: 'number',
                            min: 1,
                        }}
                    />
                }
            />
            <FormRow
                content={
                    <ButtonsControls
                        handleSave={handleSubmit(handleSave)}
                        customIsLoading={mutation.isPending}
                    />
                }
            />
        </Body>
    );
};
