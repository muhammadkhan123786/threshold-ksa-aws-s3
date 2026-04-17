import React from 'react';
import { useForm, FormProvider, SubmitHandler } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNewBranchSchema } from 'schemas';
import { useDispatch } from 'react-redux';
import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';
import { FormRow } from 'components/modal-windows/FormRow';
import { useAddBranch } from 'services/hooks/branch/useAddBranch';
import { InputController } from 'components';
import { Divider } from 'components/modal-windows';

interface BranchFormData {
    name: string;
    description?: string;
}

export const AddBranchPage: React.FC = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const addBranchMutation = useAddBranch();

    const newBranchSchema = useNewBranchSchema();

    const methods = useForm<BranchFormData>({
        mode: 'all',
        resolver: yupResolver(newBranchSchema),
    });

    const { isValid } = methods.formState;

    const handleSave: SubmitHandler<BranchFormData> = async (data) => {
        const formData: BranchFormData = {
            name: data.name,
            description: data.description,
        };

        addBranchMutation.mutate(formData, {
            onSuccess: (response) => {
                const isSuccess = [201, 200].includes(response.status);

                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? trans('form.success') : trans('form.warning'),
                            subtitle: isSuccess
                                ? trans('branch.branch_created_successfully')
                                : response.message || trans('form.error_occurred'),
                            redirect: {
                                path: 'home',
                                condition: isSuccess,
                            },
                        },
                    }),
                );
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
            },
        });
    };

    const handleCancel = async () => {
        router.navigate('home', { replace: true });
    };

    return (
        <Theme.Body>
            <Theme.TableTitle value={trans('form.addBranch.title')} variant="h2" />
            <Theme.TableUnderline />
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSave)} className="w-full mt-[15px]">
                    {/* Branch Name */}
                    <FormRow
                        title={trans('form.addBranch.name')}
                        content={
                            <InputController
                                name="name"
                                control={methods.control}
                                placeholder={trans('form.addBranch.enterName')}
                            />
                        }
                    />
                    <Divider />

                    <FormRow
                        title={trans('form.addBranch.description')}
                        content={
                            <InputController
                                name="description"
                                control={methods.control}
                                placeholder={trans('form.addBranch.enterDescription')}
                            />
                        }
                    />

                    <Divider />

                    <FormRow
                        content={
                            <ButtonsControls
                                isValid={isValid}
                                handleSave={methods.handleSubmit(handleSave)}
                                handleCancel={handleCancel}
                                saveText={trans('form.save')}
                                cancelText={trans('form.cancel')}
                            />
                        }
                    />
                </form>
            </FormProvider>
        </Theme.Body>
    );
};
