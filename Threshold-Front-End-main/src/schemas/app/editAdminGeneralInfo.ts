import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useEditAdminGeneralInfoSchema = () => {
    const { trans } = useLocales();

    const editAdminGeneralInfoValidators = {
        language: yup.object().shape(SingleSelectOption),
        notification: yup
            .boolean()
            .oneOf([true, false], trans('validation.editAdminGeneralInfo.notificationInvalid')),
    };

    return yup.object().shape(editAdminGeneralInfoValidators);
};
