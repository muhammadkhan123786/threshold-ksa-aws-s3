import * as yup from 'yup';
import { useEditCoachPersonalInfoSchema } from './editCoachPersonalInfo';
import { useEditCoachProfileSchema } from './editCoachProfile';
import { useEditCoachAccountInfoSchema } from './editCoachAccountInfo';

export const useNewCoachSchema = (activeTab: number) => {
    const editCoachPersonalInfoSchema = useEditCoachPersonalInfoSchema();
    const editCoachProfileSchema = useEditCoachProfileSchema();
    const editCoachAccountSchema = useEditCoachAccountInfoSchema();

    let newCoachValidators = {};

    if (activeTab)
        newCoachValidators = {
            ...editCoachAccountSchema.fields,
        };
    else
        newCoachValidators = {
            ...editCoachPersonalInfoSchema.fields,
            ...editCoachProfileSchema.fields,
        };
    return yup.object().shape(newCoachValidators);
};

export const EDIT_NEW_COACH_DEFAULTS = {};
