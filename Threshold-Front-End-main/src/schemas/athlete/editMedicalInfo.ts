import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useEditMedicalInfoSchema = () => {
    const { trans } = useLocales();

    const editMedicalInfoValidators = {
        dateOfUpdating: yup
            .string()
            .required(trans('validation.editMedicalInfo.dateOfUpdatingRequired')),
        allergies: yup.object().shape(SingleSelectOption),
        chronic: yup
            .array()
            .required(trans('validation.editMedicalInfo.chronicRequired'))
            .default([]),
        injury: yup.object().shape(SingleSelectOption),
        consideration: yup.object().shape(SingleSelectOption),
    };

    return yup.object().shape(editMedicalInfoValidators);
};

export const EDIT_MEDICAL_INFO_DEFAULTS = {
    dateOfUpdating: new Date().toLocaleDateString(),
};
