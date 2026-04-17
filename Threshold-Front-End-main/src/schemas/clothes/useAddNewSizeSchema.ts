import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useAddNewSizeSchema = () => {
    const { trans } = useLocales();

    return yup.object({
        newSize: yup.string().required(trans('validation.sizeTypeRequired')),
        requiredQuantity: yup.number().nullable().default(1),
    });
};
