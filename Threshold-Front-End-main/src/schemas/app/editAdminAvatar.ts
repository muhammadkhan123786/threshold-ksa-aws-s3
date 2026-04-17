import { useLocales } from 'hooks/locales';
import { MAX_FILE_SIZE } from 'libs/types/athlete';
import * as yup from 'yup';

export const useEditAdminAvatarSchema = () => {
    const { trans } = useLocales();

    const editAdminAvatarValidators = {
        avatar: yup
            .string()
            .optional()
            .nullable()
            .test('is-base64', trans('validation.editAdminAvatar.uploadImage'), (value) => {
                if (!value) return true; // If value is null or undefined, it's considered valid
                return /^data:image\/(png|jpe?g|gif);base64,/.test(value);
            })
            .test('file-size', trans('validation.editAthleteProfile.uploadImageSize'), (value) => {
                if (!value) return true;
                const sizeInBytes =
                    (value.length * 3) / 4 -
                    (value.endsWith('==') ? 2 : value.endsWith('=') ? 1 : 0);
                return sizeInBytes <= MAX_FILE_SIZE;
            }),
    };

    return yup.object().shape(editAdminAvatarValidators);
};
