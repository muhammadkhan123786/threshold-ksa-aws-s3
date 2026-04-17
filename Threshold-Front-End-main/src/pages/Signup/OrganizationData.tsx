import { InputFileController } from 'components';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useFormContext, useWatch } from 'react-hook-form';

const OrganizationData = () => {
    const { trans } = useLocales();
    const { control, trigger } = useFormContext();
    const organizationType = useWatch({ control, name: 'organizationType' });

    const label = organizationType === 'club' ? trans('signup.club') : trans('signup.academy');
    const logoLabel =
        organizationType === 'club' ? trans('signup.clubLogo') : trans('signup.academyLogo');

    const placeholder =
        organizationType === 'club'
            ? trans('signup.clubPlaceholder')
            : trans('signup.academyPlaceholder');
    // const {
    //     formState: { isValid },
    //     control,
    //     trigger,
    //     getValues,
    //     reset,
    // } = useForm({
    //     mode: 'all',
    //     resolver: yupResolver(editAdminAvatarSchema as any),
    // });
    return (
        <>
            <Theme.InputController
                type="text"
                autoComplete="name"
                {...{
                    control,
                    name: 'name',
                    label: label,
                    placeholder: placeholder,
                }}
            />
            <Theme.ImageInputWrapper>
                <Theme.ImageInputController
                    name="avatar"
                    control={control}
                    label={`${logoLabel} (${trans('signup.optional')})`}
                />
            </Theme.ImageInputWrapper>
            <Theme.InputController
                type="text"
                autoComplete="registrationNumber"
                {...{
                    control,
                    name: 'registrationNumber',
                    label: trans('signup.commercialRegistrationNumber'),
                    placeholder: trans('signup.commercialRegistrationNumberPlaceholder'),
                }}
            />
            <Theme.InputController
                type="text"
                autoComplete="contactNumber"
                {...{
                    control,
                    name: 'contactNumber',
                    label: trans('signup.contactNumber'),
                    placeholder: trans('signup.contactNumberPlaceholder'),
                }}
            />
            <Theme.InputController
                type="text"
                autoComplete="address"
                {...{
                    control,
                    name: 'address',
                    label: trans('signup.address'),
                    placeholder: trans('signup.addressPlaceholder'),
                }}
            />
            <Theme.contactsNumbersWrapper>
                <Theme.InputNumberController
                    type="text"
                    {...{
                        control,
                        name: 'phoneNumbers',
                        label: trans('signup.phoneNumber'),
                        placeholder: trans('signup.contactNumberPlaceholder'),
                    }}
                />
            </Theme.contactsNumbersWrapper>
        </>
    );
};

export default OrganizationData;
