import { useLocales } from 'hooks/locales';
import * as yup from 'yup';

export const useSessionFormSchema = () => {
    const { trans } = useLocales();

    const sessionFormValidators = {
        missionAssociated: yup
            .object()
            .required(trans('validation.sessionForm.missionAssociatedRequired')),
        volumeTargeted: yup
            .number()
            .required(trans('validation.sessionForm.volumeTargetedRequired'))
            .min(0, trans('validation.sessionForm.volumeTargetedMin'))
            .typeError(trans('validation.sessionForm.volumeTargetedInvalid')),
        sessionType: yup.object().required(trans('validation.sessionForm.sessionTypeRequired')),
        sessionTitle: yup.string().required(trans('validation.sessionForm.sessionTitleRequired')),
        space: yup.object().required(trans('validation.sessionForm.spaceRequired')),
        avgPE: yup
            .number()
            .required(trans('validation.sessionForm.avgPERequired'))
            .min(0, trans('validation.sessionForm.avgPEMin'))
            .max(10, trans('validation.sessionForm.avgPEMax'))
            .typeError(trans('validation.sessionForm.avgPEInvalid')),
        day: yup
            .date()
            .required(trans('validation.sessionForm.dayRequired'))
            .typeError(trans('validation.sessionForm.dayInvalid')),
        note: yup.string().nullable().max(500, trans('validation.sessionForm.noteMax')),
        invitedPositions: yup
            .string()
            .required(trans('validation.sessionForm.invitedPositionsRequired')),
        from: yup.string().required(trans('validation.sessionForm.startTimeRequired')),
        to: yup.string().required(trans('validation.sessionForm.endTimeRequired')),
    };

    return yup.object().shape(sessionFormValidators);
};
