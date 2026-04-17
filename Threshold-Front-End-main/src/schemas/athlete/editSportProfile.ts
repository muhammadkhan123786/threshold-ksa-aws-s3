import { useLocales } from 'hooks/locales';
import { SingleSelectOption } from 'libs/constants';
import { SportProfileType } from 'libs/enums';
import * as yup from 'yup';

export const useEditSportProfileTypeSchema = (sport: string) => {
    const { trans } = useLocales();

    let editSportProfileTypeValidators: any = {
        status: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editSportProfile.statusRequired')),
        sport: yup
            .object()
            .shape(SingleSelectOption)
            .required(trans('validation.editSportProfile.sportRequired')),
    };

    switch (sport) {
        case SportProfileType.ATHLETICS:
            editSportProfileTypeValidators = {
                ...editSportProfileTypeValidators,
                eventType: yup
                    .object()
                    .shape(SingleSelectOption)
                    .required(trans('validation.editSportProfile.eventTypeRequired')),
                sprint: yup.array().of(yup.string()).optional(),
                middleDistance: yup.array().of(yup.string()).optional(),
                longDistance: yup.array().of(yup.string()).optional(),
                hurdles: yup.array().of(yup.string()).optional(),
                relay: yup.array().of(yup.string()).optional(),
                steeplechase: yup.array().of(yup.string()).optional(),
            };
            break;
        case SportProfileType.SWIMMING:
            editSportProfileTypeValidators = {
                ...editSportProfileTypeValidators,
                eventType: yup
                    .object()
                    .shape(SingleSelectOption)
                    .required(trans('validation.editSportProfile.eventTypeRequired')),
                freestyle: yup.array().of(yup.string()).optional(),
                backstroke: yup.array().of(yup.string()).optional(),
                breaststroke: yup.array().of(yup.string()).optional(),
                butterfly: yup.array().of(yup.string()).optional(),
                im: yup.array().of(yup.string()).optional(),
                freestyleRelay: yup.array().of(yup.string()).optional(),
                medleyRelay: yup.array().of(yup.string()).optional(),
                openWaterSwimming: yup.array().of(yup.string()).optional(),
            };
            break;
        case SportProfileType.TENNIS:
            editSportProfileTypeValidators = {
                ...editSportProfileTypeValidators,
                squad: yup.array().of(yup.string()).optional(),
            };
            break;
        default:
            editSportProfileTypeValidators = {
                ...editSportProfileTypeValidators,
                foot: yup
                    .object()
                    .shape(SingleSelectOption)
                    .required(trans('validation.editSportProfile.footRequired')),
                hand: yup
                    .object()
                    .shape(SingleSelectOption)
                    .required(trans('validation.editSportProfile.handRequired')),
                position: yup
                    .object()
                    .shape(SingleSelectOption)
                    .required(trans('validation.editSportProfile.postionRequired')),
            };
            break;
    }

    return yup.object().shape(editSportProfileTypeValidators);
};

export const EDIT_SPORT_PROFILE_DEFAULTS = {
    status: null,
    sport: null,
    foot: null,
    hand: null,
    position: null,
    eventType: null,
    sprint: [],
    middleDistance: [],
    longDistance: [],
    hurdles: [],
    relay: [],
    steeplechase: [],
    freestyle: [],
    backstroke: [],
    breaststroke: [],
    butterfly: [],
    im: [],
    freestyleRelay: [],
    medleyRelay: [],
    openWaterSwimming: [],
    squad: [],
};
