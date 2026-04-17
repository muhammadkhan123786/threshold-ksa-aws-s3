import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';
import * as yup from 'yup';

export const useEditPlayerContactSchema = () => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                name: yup.string().required(trans('player.Edit.nameRequired')),

                relation: yup
                    .mixed()
                    .test(
                        'is-valid-relation',
                        trans('form.validation.relationRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.relationRequired')),

                phoneNumber: yup
                    .string()
                    .matches(/^[0-9]{10,15}$/, trans('player.Edit.phoneNumberInvalid'))
                    .required(trans('player.Edit.phoneNumberRequired')),

                nationalNumber: yup
                    .string()
                    .matches(/^[0-9]{10}$/, trans('player.Edit.nationalNumberInvalid'))
                    .required(trans('player.Edit.nationalNumberRequired')),
            }),
        [trans],
    );

    return schema;
};
