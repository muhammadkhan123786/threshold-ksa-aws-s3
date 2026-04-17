import React from 'react';
import * as Theme from './Theme';
import { useFormContext, Controller } from 'react-hook-form';
import { useLocales } from 'hooks/locales';
import { LabelInput } from '../../labelInput';
import 'react-datepicker/dist/react-datepicker.css';
import { InputController } from '../../input';

interface FormData {
    username: string;
    firstName: string;
    lastName: string;
    avatar: File | null;
    email: string;
    nationality: string;
    gender: string;
    birthday: Date | null;
    phone: string;
    emergencyPhone: string;
    relationship: string;
    educationalLevel: string;
    experience: string;
    nationalId: string;
    password: string;
    confirmPassword: string;
}

export const AccountInformation: React.FC = () => {
    const { trans } = useLocales();
    const {
        control,
        formState: { errors },
        trigger,
    } = useFormContext<FormData>();

    return (
        <Theme.Body>
            <Theme.GridWrapper>
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
