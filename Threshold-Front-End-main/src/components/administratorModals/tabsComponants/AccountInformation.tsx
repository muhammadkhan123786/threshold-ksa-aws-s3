import React from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { InputController } from '../../input';
import { LabelInput } from '../../labelInput';

interface FormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const AccountInformation: React.FC = () => {
    const { trans } = useLocales();
    const {
        control,
        formState: { errors },
    } = useFormContext<FormData>();
    return (
        <Theme.Body>
            <Theme.GridWrapper>
                {/* Username */}
                <Theme.OddWrapper>
                    <Theme.InputsWrapper>
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
                                    />
                                </>
                            )}
                        />
                    </Theme.InputsWrapper>
                </Theme.OddWrapper>

                {/* Email */}
                <Theme.OddWrapper>
                    <Theme.InputsWrapper>
                        <LabelInput label={trans('label.email')} />
                        <Controller
                            control={control}
                            name="email"
                            render={({ field, fieldState }) => (
                                <>
                                    <InputController
                                        {...field}
                                        placeholder={trans('placeholder.email')}
                                        control={control}
                                    />
                                </>
                            )}
                        />
                    </Theme.InputsWrapper>
                </Theme.OddWrapper>
                <Theme.EvenWrapper>
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
                </Theme.EvenWrapper>
            </Theme.GridWrapper>
        </Theme.Body>
    );
};
