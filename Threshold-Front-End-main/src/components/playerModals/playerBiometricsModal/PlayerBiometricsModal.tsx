import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import { router } from 'routers';
import { FormRow } from 'components/modal-windows/FormRow';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import * as Theme from './Theme';
import { useAthleteBiometricsSchema } from 'schemas/player/useAddAthleteBiometricsSchema';
import { useAthleteBiometrics } from 'services/hooks/players/useAddPlayerBiometrics';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { AthleteBiometricStatus } from 'libs/enums';
import { useFetchBodyCompositionById } from 'services/hooks';
import { SharedButton } from 'components/sharedButton';
import { useFetchBodyComposition } from 'services/hooks/players/useFetchBodyComposition';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface AddAthleteBiometricsProps {
    isOpen: boolean;
    onClose: () => void;
}

interface AthleteBiometricsForm {
    date: any;
    height: string;
    weight: string;
}

export const AddAthleteBiometrics: React.FC<AddAthleteBiometricsProps> = ({ isOpen, onClose }) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const {
        params: { id: athleteId },
    } = router.getState();

    const schema = useAthleteBiometricsSchema();

    const methods = useForm<AthleteBiometricsForm>({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: {
            date: new Date(),
            height: '',
            weight: '',
        },
    });

    const { formState } = methods;
    const { errors } = formState;

    // Fetch body composition data
    const { refetch: refetchBodyComposition } = useFetchBodyComposition(
        athleteId || '', // Make sure athleteId is correctly passed
    );

    const { mutate } = useAthleteBiometrics({
        onSuccess: (response: any) => {
            const isSuccess = [200, 201].includes(response.status);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: isSuccess ? 'success' : 'warning',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('athleteBiometrics.added_successfully')
                            : response?.message || trans('form.error_occurred'),
                    },
                }),
            );
            if (isSuccess) {
                refetchBodyComposition();
                onClose();
                setIsLoading(false);
            }
        },
        onError: (error: Error) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: error.message || trans('form.error_occurred'),
                    },
                }),
            );
            setIsLoading(false);
        },
    });

    const handleSave: SubmitHandler<AthleteBiometricsForm> = (data) => {
        setIsLoading(true);
        const sanitizedData = {
            date: data.date,
            bmi: '0.0',
            bmiPercentile: '0.0',
            height: data.height,
            weight: data.weight,
            athlete: athleteId,
            status: 'under_weight',
        };

        mutate(sanitizedData);
    };

    const { control } = methods;

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                customHeight="auto"
                onRequestClose={onClose}
                title={trans('athleteBiometrics.addBiometrics')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('athleteBiometrics.date')}
                        content={
                            <InputDateController
                                {...{
                                    control: methods.control,
                                    name: 'date',
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('athleteBiometrics.height')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'height',
                                    parse: (value: any) =>
                                        parseFloat(value.toString().replace(',', '.')), // Ensure the value is treated as a float
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('athleteBiometrics.weight')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'weight',
                                    parse: (value: any) =>
                                        parseFloat(value.toString().replace(',', '.')), // Ensure the value is treated as a float
                                }}
                            />
                        }
                    />
                    <Theme.LineHR />
                    <Theme.InputMultiElemintsWrapperRight>
                        <SharedButton variant="primary" onClick={methods.handleSubmit(handleSave)}>
                            <>{isLoading ? <SaveLoaderButton /> : trans('button.save')}</>
                        </SharedButton>
                    </Theme.InputMultiElemintsWrapperRight>
                </Theme.Body>
            </SharedModal>
        </FormProvider>
    );
};
