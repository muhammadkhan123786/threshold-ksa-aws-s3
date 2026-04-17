import React from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { InputController } from '../../input';
import { LabelInput } from '../../labelInput';

export const PersonalInformation: React.FC = () => {
    const { trans } = useLocales();
    const { control, watch, setError, clearErrors } = useFormContext();

    const password = watch('personal.password');
    const confirmPassword = watch('personal.confirmPassword');

    const validatePasswords = () => {
        if (password && confirmPassword && password !== confirmPassword) {
            setError('personal.confirmPassword', {
                type: 'manual',
                message: trans('error.passwordMismatch'),
            });
        } else {
            clearErrors('personal.confirmPassword');
        }
    };

    return (
        <Theme.Body>
            <Theme.GridWrapper>
                {/* Username */}
                <Theme.FullWidthInputsWrapper>
                    <LabelInput label={trans('label.username')} />
                    <Controller
                        control={control}
                        name="username"
                        render={({ field, fieldState }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.username')}
                                    required
                                />
                            </>
                        )}
                    />
                </Theme.FullWidthInputsWrapper>

                {/* Email */}
                <Theme.FullWidthInputsWrapper>
                    <LabelInput label={trans('label.email')} />
                    <Controller
                        control={control}
                        name="email"
                        render={({ field, fieldState }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    placeholder={trans('placeholder.email')}
                                    required
                                />
                            </>
                        )}
                    />
                </Theme.FullWidthInputsWrapper>

                {/* Password */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.password')} />
                    <Controller
                        control={control}
                        name="password"
                        render={({ field, fieldState }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    type="password"
                                    placeholder={trans('placeholder.password')}
                                    required
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>

                {/* Confirm Password */}
                <Theme.InputsWrapper>
                    <LabelInput label={trans('label.confirmPassword')} />
                    <Controller
                        control={control}
                        name="confirmPassword"
                        render={({ field, fieldState }) => (
                            <>
                                <InputController
                                    {...field}
                                    control={control}
                                    type="password"
                                    placeholder={trans('placeholder.confirmPassword')}
                                />
                            </>
                        )}
                    />
                </Theme.InputsWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
