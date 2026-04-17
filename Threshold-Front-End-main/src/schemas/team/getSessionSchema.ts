import * as yup from 'yup';
import { SportProfileType, PlayingSessionStatus, PlayingSessionType } from 'libs/enums';
import { useLocales } from 'hooks/locales';

export const getSessionSchema = (
    sportType?: SportProfileType,
    sessionStatus?: PlayingSessionStatus,
    sessionType?: PlayingSessionType,
) => {
    const { trans } = useLocales();

    switch (sessionStatus) {
        case PlayingSessionStatus.NOT_STARTED:
        case PlayingSessionStatus.STARTED:
            return yup.object().shape({
                status: yup.string().required(trans('editSession.validation.statusRequired')),
                comment: yup.string().nullable(),
            });

        case PlayingSessionStatus.PREPARATION_COMPLETE:
        case PlayingSessionStatus.DONE:
            switch (sportType) {
                case SportProfileType.SWIMMING:
                    return yup.object().shape({
                        scale: yup
                            .string()
                            .required(trans('editSession.validation.scaleRequired'))
                            .matches(/^[0-9]+$/, trans('editSession.validation.scaleInvalid')),
                        status: yup
                            .string()
                            .required(trans('editSession.validation.statusRequired')),
                        comment: yup.string().nullable(),
                    });

                case SportProfileType.ATHLETICS:
                    return yup.object().shape({
                        preparationComplete: yup
                            .boolean()
                            .oneOf(
                                [true],
                                trans('editSession.validation.preparationCompleteRequired'),
                            ),
                        status: yup
                            .string()
                            .required(trans('editSession.validation.statusRequired')),
                        comment: yup.string().nullable(),
                    });

                default:
                    return yup.object().shape({
                        scale: yup
                            .string()
                            .nullable()
                            .matches(/^[0-9]+$/, trans('editSession.validation.scaleInvalid')),
                        status: yup
                            .string()
                            .required(trans('editSession.validation.statusRequired')),
                        comment: yup.string().nullable(),
                    });
            }

        default:
            return yup.object().shape({
                scale: yup
                    .string()
                    .nullable()
                    .matches(/^[0-9]+$/, trans('editSession.validation.scaleInvalid')),
                status: yup.string().required(trans('editSession.validation.statusRequired')),
                comment: yup.string().nullable(),
            });
    }
};
