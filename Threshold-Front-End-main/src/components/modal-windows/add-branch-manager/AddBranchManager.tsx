import React from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { InputController } from 'components/input';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { setModalContent } from 'store/controlsSlice';
import { useDispatch } from 'react-redux';
import { useCreateAdminManager, useFetchAdminManagerById } from 'services/hooks';
import { useAddBranchManagerSchema } from 'schemas';
import { InputFileController } from 'components/inputFile';
import { ErrorBox, UploadText } from './Theme';
import { Gender, Nationality } from 'libs/enums';
import { arrayToSelectOptions, selectOptionsToValues } from 'libs/helpers';
import { MultiSelectController } from 'components/multi-selection';

interface Props extends FormWindowProps, FormControlsProps {
    id: string;
}

export const AddBranchManager: React.FC<Props> = (props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { defaultValues, id } = props;

    const { refetch } = useFetchAdminManagerById(id);

    const schema = useAddBranchManagerSchema();
    const { control, getValues, trigger, handleSubmit } = useForm({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: defaultValues || schema.cast({}),
    });

    const mutation = useCreateAdminManager({
        onSuccess: () => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.addBranchManager.successTitle'),
                        subtitle: trans('form.addBranchManager.successMessage'),
                    },
                }),
            );

            refetch();
        },
    });

    const handleSave = () => {
        const values = getValues();
        const formData = selectOptionsToValues({ ...values }, ['nationality', 'gender']);
        mutation.mutate({ ...(formData as any), branch_id: id });
    };

    return (
        <Body>
            <FormRow
                title={trans('form.addBranchManager.avatarTitle')}
                subtitle={trans('form.addBranchManager.avatarSubtitle')}
                content={
                    <InputFileController
                        {...{
                            control,
                            trigger,
                            name: 'avatar',
                            contents: (
                                <UploadText>
                                    <span>{trans('form.addBranchManager.uploadText1')}</span>
                                    {trans('form.addBranchManager.uploadText2')}
                                    <br />
                                    {trans('form.addBranchManager.uploadText3')}
                                </UploadText>
                            ),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addBranchManager.nationalityTitle')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'nationality',
                            options: arrayToSelectOptions({ array: Nationality }),
                            transSuffix: 'form.editAthleteProfile.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addBranchManager.ninTitle')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'nin',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addBranchManager.genderTitle')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'gender',
                            options: arrayToSelectOptions({ array: Gender }),
                            transSuffix: 'global.',
                            menuPlacement: 'top',
                            defaultValue: defaultValues['gender'],
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addBranchManager.contactNumberTitle')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'phoneNumber',
                            placeholder: trans('form.addBranchManager.contactNumberPlaceholder'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.username')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'username',
                            placeholder: trans('form.enterUsername'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addBranchManager.emailTitle')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'email',
                            placeholder: trans('form.addBranchManager.emailPlaceholder'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addBranchManager.passwordTitle')}
                content={
                    <InputController
                        type="password"
                        {...{
                            control,
                            name: 'password',
                            placeholder: trans('form.addBranchManager.passwordPlaceholder'),
                        }}
                    />
                }
            />
            <Divider />
            <FormRow
                title={trans('form.addBranchManager.confirmPasswordTitle')}
                content={
                    <InputController
                        type="password"
                        {...{
                            control,
                            name: 'confirmPassword',
                            placeholder: trans('form.addBranchManager.confirmPasswordPlaceholder'),
                        }}
                    />
                }
            />
            <Divider />

            {mutation.isError && <ErrorBox>{mutation.error.message}</ErrorBox>}

            {/* buttons */}
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
