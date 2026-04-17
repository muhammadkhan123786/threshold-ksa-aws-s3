import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useUpdateClubSchema = () => {
    const { trans } = useLocales();
    return yup.object().shape({
        name: yup.string().required(trans('validation.club.nameRequired')),
        registrationNumber: yup
            .string()
            .required(trans('validation.club.registrationNumberRequired')),
        contactNumber: yup
            .string()
            .matches(/^05\d{8}$/, trans('validation.club.contactNumberInvalid'))
            .required(trans('validation.club.contactNumberRequired')),
        address: yup.string().required(trans('validation.club.addressRequired')),
    });
};
