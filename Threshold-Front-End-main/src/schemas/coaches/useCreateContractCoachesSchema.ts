import { useLocales } from 'hooks/locales';
import { useMemo } from 'react';
import * as yup from 'yup';
export const useCreateContractCoachesSchema = (hasExistingContract: boolean) => {
    const { trans } = useLocales();

    const schema = useMemo(
        () =>
            yup.object().shape({
                joinDate: yup.date().required(trans('form.validation.joinDateRequired')),
                type: yup
                    .mixed()
                    .test(
                        'is-valid-relationship',
                        trans('form.validation.relationshipRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contractType')),

                contractDuration: yup
                    .mixed()
                    .test(
                        'is-valid-relationship',
                        trans('form.validation.relationshipRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contractDuration')),

                status: yup
                    .mixed()
                    .test(
                        'is-valid-relationship',
                        trans('form.validation.relationshipRequired'),
                        (value) =>
                            typeof value === 'string' ||
                            (typeof value === 'object' && value !== null),
                    )
                    .required(trans('form.validation.contractStatus')),

                contractFile: hasExistingContract
                    ? yup.mixed().notRequired() // Skip validation if existing contract exists
                    : yup
                          .mixed()
                          .nullable()
                          .required(trans('validation.fileRequired'))
                          .test(
                              'fileSize',
                              trans('validation.fileSize'),
                              (value) => value && (value as File).size <= 5242880, // 5 MB max size
                          )
                          .test(
                              'fileType',
                              trans('validation.fileType'),
                              (value) =>
                                  value && ['application/pdf'].includes((value as File).type),
                          ),
            }),
        [trans, hasExistingContract],
    );

    return schema;
};
