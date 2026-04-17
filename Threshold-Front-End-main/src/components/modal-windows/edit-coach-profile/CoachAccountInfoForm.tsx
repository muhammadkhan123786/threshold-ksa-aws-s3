import { FormRow } from '../FormRow';
import { Divider } from '../Theme';
import { InputController } from 'components/input';
import { useLocales } from 'hooks/locales';
import { useEffect } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';

interface Props {
    defaultValues?: { [key: string]: any };
}

export const CoachAccountInfoForm = (props: Props) => {
    const { trans } = useLocales();
    const { control, trigger } = useFormContext();
    const { isDirty } = useFormState({ control });

    useEffect(() => {
        if (isDirty) {
            trigger();
        }
    }, [isDirty]);

    return (
        <>
            {/* Email */}

            <FormRow
                title={trans('form.addCoach.username')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'username',
                            placeholder: trans('form.enterUsername'),
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.addCoach.email')}
                content={
                    <InputController
                        type="text"
                        {...{
                            control,
                            name: 'email',
                            placeholder: trans('form.enterEmail'),
                        }}
                    />
                }
            />
            <Divider />

            {/* Password */}
            <FormRow
                title={trans('form.addCoach.password')}
                content={
                    <InputController
                        type="password"
                        {...{
                            control,
                            name: 'password',
                            placeholder: trans('form.enterPassword'),
                        }}
                    />
                }
            />
            <Divider />

            {/* Confirm Password */}
            <FormRow
                title={trans('form.addCoach.confirmPassword')}
                content={
                    <InputController
                        type="password"
                        {...{
                            control,
                            name: 'confirmPassword',
                            placeholder: trans('form.enterConfirmPassword'),
                        }}
                    />
                }
            />
            <Divider />
        </>
    );
};
