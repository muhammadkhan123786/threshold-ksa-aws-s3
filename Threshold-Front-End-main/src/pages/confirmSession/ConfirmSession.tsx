import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Divider } from 'components/modal-windows';
import { FormRow } from 'components/modal-windows/FormRow';
import {} from 'components/input';
import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DrillPlanningTool from './components/drillPlanning/DrillPlanningTool';
import { useDrillPlanningValidation } from 'schemas';
import { InputController, Loader } from 'components';
import DrillList from './components/drillList/drillList';
import useFetchSessionAndPlanningSessions from 'services/hooks/sessions/useFetchSessionAndPlanningSessions';
import router from 'routers/router';
import { useCreatePlanningSession } from 'services/hooks/sessions/useCreatePlanningSession';
import { useRef } from 'react';
import html2canvas from 'html2canvas';

export const ConfirmSession = () => {
    const { trans, formatDate } = useLocales();

    const {
        params: { id },
    } = router.getState();

    const { data, isLoading, refetch } = useFetchSessionAndPlanningSessions(id);

    const { mutate: createPlanningSession, isPending: isCreating } = useCreatePlanningSession({
        onSuccess: () => {
            refetch();
        },
    });

    const validationSchema = useDrillPlanningValidation();

    const methods = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'all',
        defaultValues: validationSchema.cast({}),
    });

    const drawAreaRef = useRef<HTMLDivElement | null>(null);

    const captureDrawAreaAsImage = async () => {
        if (drawAreaRef.current) {
            const canvas = await html2canvas(drawAreaRef.current);
            const base64Image = canvas.toDataURL('image/png');
            methods.setValue('drillImage', base64Image);
            return base64Image;
        }
    };

    const onSubmit = async (formData: any) => {
        const drillImage = await captureDrawAreaAsImage();
        const createPlanningSessionDto = {
            ...formData,
            drillImage,
        };
        createPlanningSession({ sessionId: id, createPlanningSessionDto });

        methods.reset({ ...validationSchema.cast({}) });
    };

    const handleNavigationActions = async () => {
        router.navigate('home');
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Theme.Body>
            <Theme.Header>
                <Theme.Title
                    value={trans('confirm-session.title', {
                        defaultValue: 'Practice Planning Session',
                    })}
                    variant="h3"
                />
                <Theme.SubTitle
                    value={String(formatDate(data?.date, 'DD-MM-YYYY [at] hh:mm A'))}
                    variant="h3"
                />
            </Theme.Header>
            <Theme.Content>
                <Theme.Title
                    value={trans('confirm-session.drillDetails', {
                        defaultValue: 'Drill details',
                    })}
                    variant="h3"
                />
                <FormProvider {...methods}>
                    <form onSubmit={methods.handleSubmit(onSubmit)}>
                        <FormRow
                            title={trans('form.confirm-session.drill.title', {
                                defaultValue: 'Drill title',
                            })}
                            content={
                                <InputController
                                    type="text"
                                    control={methods.control}
                                    name="title"
                                    placeholder={trans('form.enterDrillTitle')}
                                />
                            }
                        />
                        <FormRow
                            title={trans('form.confirm-session.drill.description', {
                                defaultValue: 'Drill description',
                            })}
                            content={
                                <InputController
                                    type="text"
                                    control={methods.control}
                                    name="description"
                                    placeholder={trans('form.enterDrillDescription')}
                                />
                            }
                        />
                        <FormRow
                            title={trans('form.confirm-session.drill.theme', {
                                defaultValue: 'Theme',
                            })}
                            content={
                                <Theme.InputsWrapper>
                                    <InputController
                                        type="text"
                                        control={methods.control}
                                        name="theme"
                                        placeholder={trans('form.enterTheme')}
                                    />
                                    <InputController
                                        type="text"
                                        control={methods.control}
                                        name="trainingLoad"
                                        placeholder={trans('form.enterTrainingLoad')}
                                    />
                                </Theme.InputsWrapper>
                            }
                        />
                        <FormRow
                            title={trans('form.confirm-session.drill.space', {
                                defaultValue: 'Space',
                            })}
                            content={
                                <Theme.InputsWrapper>
                                    <InputController
                                        type="text"
                                        name="space"
                                        control={methods.control}
                                        placeholder={trans('form.enterSpace')}
                                    />
                                    <InputController
                                        type="text"
                                        control={methods.control}
                                        name="timeLoad"
                                        placeholder={trans('form.enterTimeLoad')}
                                    />
                                </Theme.InputsWrapper>
                            }
                        />

                        <DrillPlanningTool methods={methods} ref={drawAreaRef} />

                        <Theme.InputsWrapper>
                            <Theme.SaveButton type="submit" isLoading={isCreating}>
                                {trans('form.save')}
                            </Theme.SaveButton>
                        </Theme.InputsWrapper>
                    </form>
                </FormProvider>
            </Theme.Content>
            <Divider className="my-[10px]" />
            <Divider className="my-[10px]" />

            <DrillList />
            <FormRow
                content={
                    <ButtonsControls
                        saveText={'form.save'}
                        cancelText={'form.back'}
                        handleCancel={handleNavigationActions}
                        handleSave={handleNavigationActions}
                    />
                }
            />
        </Theme.Body>
    );
};
