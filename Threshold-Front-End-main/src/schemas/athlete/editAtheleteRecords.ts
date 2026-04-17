import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useEditAthelteRecordsSchema = () => {
    const { trans } = useLocales();

    const editMedicalInfoValidators = {
        category: yup
            .object()
            .shape({
                value: yup.string().required(trans('validation.editRecordInfo.categoryRequired')), // Adjust if category is a string or an object
            })
            .required(trans('validation.editRecordInfo.categoryRequired')),
        subcategory: yup.string(),
        personalRecord: yup
            .number()
            // .required(trans('validation.editRecordInfo.personalRecordInvalid'))
            .typeError(trans('validation.editRecordInfo.personalRecordInvalid')),
        bestRecord: yup
            .number()
            // .required(trans('validation.editRecordInfo.bestRecordInvalid'))
            .typeError(trans('validation.editRecordInfo.bestRecordInvalid')),
        lastRecord: yup
            .number()
            // .required(trans('validation.editRecordInfo.lastRecordInvalid'))
            .typeError(trans('validation.editRecordInfo.lastRecordInvalid')),
    };

    return yup.object().shape(editMedicalInfoValidators);
};

export const useAddAthelteRecordsSchema = () => {
    const { trans } = useLocales();

    const editMedicalInfoValidators = {
        category: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editRecordInfo.categoryRequired')),
        subcategory: yup.string().required(trans('validation.editRecordInfo.subCategoryRequired')),
        personalRecord: yup
            .number()
            .required(trans('validation.editRecordInfo.personalRecordInvalid'))
            .typeError(trans('validation.editRecordInfo.personalRecordInvalid')),
        bestRecord: yup
            .number()
            .required(trans('validation.editRecordInfo.bestRecordInvalid'))
            .typeError(trans('validation.editRecordInfo.bestRecordInvalid')),
        lastRecord: yup
            .number()
            .required(trans('validation.editRecordInfo.lastRecordInvalid'))
            .typeError(trans('validation.editRecordInfo.lastRecordInvalid')),
    };

    return yup.object().shape(editMedicalInfoValidators);
};
