import { FormRow } from '../FormRow';
import { Control, UseFormGetValues, UseFormTrigger } from 'react-hook-form';
import { Divider } from '../Theme';
import * as Theme from './Theme';
import { InputController } from 'components/input';
import { useLocales } from 'hooks/locales';
import { InputFileController } from 'components/inputFile';
import { getAvatarPlaceholder } from 'libs/constants';

interface Props {
    control: Control<any, any>;
    trigger: UseFormTrigger<any>;
    getValues: UseFormGetValues<any>;
    defaultValues?: { [key: string]: any };
}

export const CoachProfileInfoForm = ({
    control,
    trigger,
    getValues,
    defaultValues = {},
}: Props) => {
    const { trans } = useLocales();

    return (
        <>
            {/* name */}
            <FormRow
                title={trans('form.editAthleteProfile.name')}
                content={
                    <div className="flex justify-between gap-5 w-full">
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'firstName',
                                placeholder: trans('form.enterFirstName'),
                            }}
                        />
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'lastName',
                                placeholder: trans('form.enterLastName'),
                            }}
                        />
                    </div>
                }
            />
            <Divider />

            {/* avatar */}
            <FormRow
                title={trans('form.editAthleteProfile.coachPhoto')}
                content={
                    <InputFileController
                        {...{
                            control,
                            trigger,
                            name: 'avatar',
                            contents: (
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>{' '}
                                    {trans('form.editAthleteProfile.uploadText2')}
                                    <br />
                                    {trans('form.editAthleteProfile.uploadText3')}
                                </Theme.UploadText>
                            ),
                        }}
                    />
                }
            />
            <Divider />
        </>
    );
};
