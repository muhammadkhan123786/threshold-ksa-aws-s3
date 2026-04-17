import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useNewTeamSchema = () => {
    const { trans } = useLocales();

    const newTeamValidators = {
        creationDate: yup.string().required(trans('validation.newTeam.creationDateRequired')),
        branch: yup.object().shape(SingleSelectOption),
        name: yup.string().required(trans('validation.newTeam.nameRequired')),
        sport: yup.object().shape(SingleSelectOption),
        coach: yup.object().shape(SingleSelectOption),
        athletes: yup.array().min(1, trans('validation.newTeam.athletesRequired')),
        logo: yup
            .string()
            .optional()
            .nullable()
            .test('is-base64', trans('validation.newTeam.uploadImage'), (value) => {
                if (!value) return true; // If value is null or undefined, it's considered valid
                return /^data:image\/(png|jpe?g|gif);base64,/.test(value);
            }),
    };

    return yup.object().shape(newTeamValidators);
};

export const EDIT_NEW_TEAM_DEFAULTS = {
    athletes: [],
};
