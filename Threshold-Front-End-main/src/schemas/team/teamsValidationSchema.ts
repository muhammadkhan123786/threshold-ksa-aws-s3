import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import * as yup from 'yup';

export const useNewTeamSchema = () => {
    const { trans } = useLocales();

    const newTeamValidators = {
        ageOfPlayers: yup
            .string()
            .required(
                trans('validation.newTeam.creationDateRequired') || 'Creation date is required.',
            ),
        name: yup.string().required(trans('validation.newTeam.name')),
        coach: yup.object().required(trans('validation.newTeam.coachRequired')),
        subCoaches: yup.array().required(trans('validation.newTeam.subCoachesRequired')),
        admin: yup.object().required(trans('validation.newTeam.adminRequired')),
        athletes: yup
            .array()
            .min(1, trans('validation.newTeam.athletesRequired'))
            .test(
                'non-empty-array',
                trans('validation.newTeam.athletesEmptyArray') ||
                    'Athletes array must not be empty.',
                (value) => {
                    return Array.isArray(value) && value.length > 0;
                },
            )
            .required(trans('validation.newTeam.athletesRequired')),
        logo: yup.mixed().optional().nullable(),
        background: yup.mixed().optional().nullable(),
    };

    return yup.object().shape(newTeamValidators);
};

export const EDIT_NEW_TEAM_DEFAULTS = {
    athletes: [],
};
