import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useEditAdminPersonalInfoSchema = () => {
    const { trans } = useLocales();

    const editAdminPersonalInfoValidators = {
        username: yup.string().required(trans('validation.editAdminPersonalInfo.nameRequired')),
        email: yup
            .string()
            .required(trans('validation.editAdminPersonalInfo.emailRequired'))
            .matches(
                /^[a-zA-Z0-9. _-]+@[a-zA-Z0-9. -]+\.[a-zA-Z]{2,4}$/,
                trans('validation.editAdminPersonalInfo.emailInvalid'),
            ),
        phoneNumber: yup
            .string()
            .required(trans('validation.editAdminPersonalInfo.phoneRequired'))
            .matches(/^(05)\d{8}$/, trans('validation.editAdminPersonalInfo.phoneInvalid')),
    };

    return yup.object().shape(editAdminPersonalInfoValidators);
};
