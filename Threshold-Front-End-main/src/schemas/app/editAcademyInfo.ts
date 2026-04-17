import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useEditAcademyInfoSchema = () => {
    const { trans } = useLocales();

    const editAcademyInfoValidators = {
        name: yup
            .string()
            .required(trans('validation.editAcademyInfo.academyNameRequired'))
            .default(''),
        isMultiBranch: yup
            .boolean()
            .required(trans('signup.validation.register.isMultiBranchRequired'))
            .default(false),
        registrationNumber: yup
            .string()
            .required(trans('validation.editAcademyInfo.commercialRegNumberRequired'))
            .matches(/^\d{10}$/, trans('validation.editAcademyInfo.invalidNumber'))
            .default(''),
        contactNumber: yup
            .string()
            .required(trans('validation.editAcademyInfo.academyContactNumberRequired'))
            .matches(/^(05)\d{8}$/, trans('validation.editAcademyInfo.invalidPhoneNumber'))
            .default(''),
    };

    return yup.object().shape(editAcademyInfoValidators);
};
