import * as Yup from 'yup';
import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';

export const useNewBranchSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            Yup.object().shape({
                name: Yup.string()
                    .required(trans('validation.required', { field: 'Branch name' }))
                    .min(3, trans('validation.min_length', { field: 'Branch name', min: 3 }))
                    .max(50, trans('validation.max_length', { field: 'Branch name', max: 50 })),
                description: Yup.string().max(
                    500,
                    trans('validation.max_length', { field: 'Description', max: 500 }),
                ),
            }),
        [trans],
    );

    return schema;
};
