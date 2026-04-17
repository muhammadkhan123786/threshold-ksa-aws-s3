import { useForm, FormProvider } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNewCoachSchema } from 'schemas';
import { selectOptionsToValues } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { coachAPIs } from 'services/apis';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';
import { useEffect, useState } from 'react';
import { FormRow } from 'components/modal-windows/FormRow';
import { CoachPersonalInfoForm } from 'components/modal-windows';
import { CoachProfileInfoForm } from 'components/modal-windows/edit-coach-profile/CoachProfileInfoForm';
import { CoachAccountInfoForm } from 'components/modal-windows/edit-coach-profile/CoachAccountInfoForm';

export const AddCoachPage = () => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { academy } = useSelector(selectAcademy);
    const [activeTab, setActiveTab] = useState(0);
    const [coachData, setCoachData] = useState({});

    const newCoachSchema = useNewCoachSchema(activeTab);

    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(newCoachSchema),
    });

    const { isValid } = methods.formState;

    const handleTabSwitch = (next = true) => {
        setActiveTab((prev) => (next ? (prev + 1) % 2 : prev === 0 ? 1 : prev - 1));
    };

    const handleSave = async (data: any) => {
        if (activeTab !== 1) {
            handleTabSwitch();
            setCoachData((prev) => ({ ...prev, ...data }));
            return;
        }

        const formData = selectOptionsToValues({ ...coachData, ...data }, ['sport', 'gender']);

        const response = await dispatch(
            coachAPIs.createCoach()({
                ...formData,
                academy: academy.id,
            }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: isSuccess ? 'success' : 'warning',
                    title: isSuccess ? 'Success' : 'Warning',
                    subtitle: isSuccess
                        ? 'Coach has been created successfully'
                        : response?.payload?.payload?.payload ||
                          response?.payload?.payload?.message,
                    redirect: {
                        path: 'home',
                        condition: isSuccess,
                    },
                },
            }),
        );
    };

    const handleCancel = async () => {
        if (activeTab === 0) {
            router.navigate('home', { replace: true });
        } else {
            handleTabSwitch(false);
        }
    };

    const pagesMapping = {
        0: (
            <>
                <CoachProfileInfoForm
                    control={methods.control}
                    trigger={methods.trigger}
                    getValues={methods.getValues}
                />
                <CoachPersonalInfoForm control={methods.control} />
            </>
        ),
        1: <CoachAccountInfoForm />,
    } as any;

    return (
        <Theme.Body>
            <Theme.TableTabsWrapper className="cursor-pointer">
                {['addCoach.personale.information', 'addCoach.account.information'].map(
                    (name, index) => (
                        <Theme.TableTab
                            key={index}
                            $isActive={activeTab === index}
                            onClick={() => setActiveTab(index)}
                        >
                            {trans(`${name}`)}
                        </Theme.TableTab>
                    ),
                )}
            </Theme.TableTabsWrapper>
            <Theme.TableUnderline />
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(handleSave)} className="w-full mt-[15px]">
                    {pagesMapping[activeTab]}
                    <FormRow
                        content={
                            <ButtonsControls
                                isValid={isValid}
                                handleSave={methods.handleSubmit(handleSave)}
                                handleCancel={handleCancel}
                                saveText={activeTab === 0 ? 'form.next' : 'form.save'}
                                cancelText={activeTab === 0 ? 'form.cancel' : 'form.back'}
                            />
                        }
                    />
                </form>
            </FormProvider>
        </Theme.Body>
    );
};
