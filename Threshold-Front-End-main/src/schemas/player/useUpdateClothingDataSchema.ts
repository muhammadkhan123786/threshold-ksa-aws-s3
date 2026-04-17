import { useMemo } from 'react';
import * as yup from 'yup';
import { useLocales } from 'hooks/locales';

export const useUpdateClothingDataSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                tShirtSize: yup
                    .mixed()
                    .test(
                        'is-valid-size',
                        trans('form.validation.tShirtSizeRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.tShirtSizeRequired')),

                pantSize: yup
                    .mixed()
                    .test(
                        'is-valid-size',
                        trans('form.validation.pantSizeRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.pantSizeRequired')),

                shoeSize: yup
                    .mixed()
                    .test(
                        'is-valid-size',
                        trans('form.validation.shoeSizeRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.shoeSizeRequired')),

                driFitSize: yup
                    .mixed()
                    .test(
                        'is-valid-size',
                        trans('form.validation.driFitSizeRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.driFitSizeRequired')),
            }),
        [trans],
    );

    return schema;
};
