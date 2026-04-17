import { InputDateController } from 'components/inputDate';
import { FormRow } from '../FormRow';
import { Control } from 'react-hook-form';
import { Divider } from '../Theme';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions, getDateYearsFromNow } from 'libs/helpers';
import { Gender, SportProfileType } from 'libs/enums';
import { InputController } from 'components/input';
import { useLocales } from 'hooks/locales';

interface Props {
    control: Control<any, any>;
    defaultValues?: { [key: string]: any };
}

export const CoachPersonalInfoForm = ({ control, defaultValues = {} }: Props) => {
    const { trans } = useLocales();

    return (
        <>
            <FormRow
                title={trans('form.addCoach.joinDate')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'joinDate',
                            withPortal: true,
                            defaultValue: defaultValues['joinDate'],
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.sport')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'sport',
                            options: arrayToSelectOptions({ array: SportProfileType }),
                            transSuffix: 'sport.',
                            menuPlacement: 'bottom',
                            defaultValue: defaultValues['sport'],
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.gender')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'gender',
                            options: arrayToSelectOptions({ array: Gender }),
                            transSuffix: 'global.',
                            menuPlacement: 'top',
                            defaultValue: defaultValues['gender'],
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.phone')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'phone',
                            defaultValue: defaultValues['phone'],
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.birth')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'birthday',
                            defaultValue: defaultValues['birthday'],
                        }}
                        maxDate={getDateYearsFromNow(20)}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.experience')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'experience',
                            defaultValue: defaultValues['experience'],
                        }}
                    />
                }
            />
            <Divider />
        </>
    );
};
