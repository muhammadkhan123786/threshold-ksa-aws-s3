import React, { useState } from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { SharedModal } from '../../sharedModal';
import { useLocales } from 'hooks/locales';
import { useDispatch } from 'react-redux';
import { setModalContent } from 'store/controlsSlice';
import {
    ADD_FITNESS_BATTERY_DEFAULTS,
    useAddFitnessBatterySchema,
} from 'schemas/player/useAddFitnessBatterySchema';
import { router } from 'routers';
import { FormRow } from 'components/modal-windows/FormRow';
import { InputDateController } from 'components/inputDate';
import { InputController } from 'components/input';
import * as Theme from './Theme';
import { useAddFitnessBattery } from 'services/hooks/players/useAddFitnessBattery';
import { SharedButton } from 'components/sharedButton';
import { useFetchPlayerBatteries } from 'services/hooks/players/useFetchPlayerBatteries';
import { SaveLoaderButton } from 'components/saveLoaderButton';

interface AddFitnessBatteryModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface FitnessBatteryForm {
    date: Date;
    curl: string;
    push: string;
    trunk: string;
    sit: string;
    pacer: string;
}

export const AddFitnessBatteryModal: React.FC<AddFitnessBatteryModalProps> = ({
    isOpen,
    onClose,
}) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const schema = useAddFitnessBatterySchema();
    const [isLoading, setIsLoading] = useState(false);

    // Get athlete ID from router state
    const {
        params: { id: athleteId },
    } = router.getState();

    // Use react-hook-form for form handling
    const methods = useForm<FitnessBatteryForm>({
        mode: 'all',
        resolver: yupResolver(schema),
        defaultValues: ADD_FITNESS_BATTERY_DEFAULTS,
    });
    const { refetch: refetchPlayerBatteries } = useFetchPlayerBatteries(
        athleteId || '', // Make sure athleteId is correctly passed
    );

    // Set up mutation hook to call the API
    const { mutate } = useAddFitnessBattery({
        onSuccess: (response: any) => {
            const isSuccess = [200, 201].includes(response.status);

            dispatch(
                setModalContent({
                    modalContent: {
                        type: isSuccess ? 'success' : 'warning',
                        title: trans('form.success'),
                        subtitle: isSuccess
                            ? trans('fitnessBattery.added_successfully')
                            : response?.message || trans('form.error_occurred'),
                    },
                }),
            );
            if (isSuccess) {
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

    const handleSave: SubmitHandler<FitnessBatteryForm> = (data) => {
        setIsLoading(true);
        const transformedData = {
            ...data,
            date: data.date.toISOString().split('T')[0],
            athlete: athleteId,
        };
        mutate(transformedData);
        refetchPlayerBatteries();
    };

    return (
        <FormProvider {...methods}>
            <SharedModal
                isOpen={isOpen}
                onRequestClose={onClose}
                customHeight="100%"
                title={trans('fitnessBattery.addFitnessBattery')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('fitnessBattery.date')}
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
                        title={trans('fitnessBattery.curl')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'curl',
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('fitnessBattery.push')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'push',
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('fitnessBattery.trunk')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'trunk',
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('fitnessBattery.sit')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'sit',
                                }}
                            />
                        }
                    />
                    <FormRow
                        style={{ display: 'block', color: '#7d7d7d' }}
                        title={trans('fitnessBattery.pacer')}
                        content={
                            <InputController
                                {...{
                                    control: methods.control,
                                    name: 'pacer',
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
