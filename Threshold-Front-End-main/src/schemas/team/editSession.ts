import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useEditSessionSchema = (records: any[]) => {
    const { trans } = useLocales();

    const athletesValidators: {
        [key: string]: yup.ObjectSchema<any> | yup.StringSchema<any>;
    } = {};

    records &&
        records.forEach(({ id }) => {
            athletesValidators[id] = yup.object().shape({
                status: yup.string().required(trans('validation.editSession.scaleRequired')),
                scale: yup
                    .string()
                    .nullable() // Ensure scale can be null
                    .test(
                        'check-scale',
                        trans('validation.editSession.scaleRequired'),
                        function (value) {
                            const { status } = this.parent;
                            if (status !== 'present') {
                                return true; // Skip validation if status matches
                            }
                            return yup
                                .string()
                                .required(trans('validation.editSession.scaleRequired'))
                                .matches(
                                    /^(0?[0-9]|10)$/,
                                    trans('validation.editSession.scaleInvalid'),
                                )
                                .isValidSync(value);
                        },
                    ),
                comment: yup.string().nullable().default(''),
            });
        });

    const editSessionValidators = {
        status: yup.object().shape(SingleSelectOption),
        ...athletesValidators,
    };

    return yup.object().shape(editSessionValidators);
};

export const EDIT_NEW_TEAM_DEFAULTS = {};
