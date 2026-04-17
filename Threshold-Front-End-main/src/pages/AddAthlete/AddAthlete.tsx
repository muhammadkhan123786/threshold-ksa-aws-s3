import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useState } from 'react';
import {
    EditMedicalInfo,
    EditAthletePersonalInfo,
    EditAthleteProfile,
} from 'components/modal-windows';
import { fireAlert, selectOptionsToValues } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { athleteAPIs } from 'services/apis';
import { selectAcademy } from 'store';
import { breadCrumpPop, closeModal, setModalContent, switchActiveTab } from 'store/controlsSlice';
import { router } from 'routers';

export const AddAthlete = () => {
    const { trans } = useLocales();
    const [activeTab, setActiveTab] = useState<0 | 1 | 2>(0);
    const [athleteData, setAthleteData] = useState<{ [key: string]: any } | null>(null);
    const dispatch = useDispatch();
    const { academy } = useSelector(selectAcademy);

    const tableTabsData = ['profile', 'personalInfo', 'medicalInfo'];

    const handleTabSwitch = (next: boolean = true) => {
        switch (activeTab) {
            case 0:
                setActiveTab(1);
                break;
            case 1:
                setActiveTab(next ? 2 : 0);
                break;
            case 2:
                setActiveTab(1);
                break;
            default:
                break;
        }
    };

    const handleSave = async (data?: any) => {
        if (activeTab !== 2) {
            handleTabSwitch();
            return;
        }

        const formData = selectOptionsToValues({ ...athleteData, ...data } || {}, [
            'relationship',
            'nationality',
            'education',
            'gender',
            'allergies',
            'injury',
            'consideration',
            'sport',
            'branch',
            'status',
            'periodOfSubscription',
            'paymentMethod',
        ]);

        const response = await dispatch(
            athleteAPIs.createAthlete()({
                ...formData,
                academy: academy.id,
                chronic: formData.chronic ? formData.chronic.map((item: any) => item.value) : [],
            }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        if (isSuccess) {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: 'Success',
                        subtitle: 'Athlete data has been updated',
                        redirect: {
                            path: 'home',
                            condition: isSuccess,
                        },
                    },
                }),
            );
        } else {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Warning',
                        subtitle: response?.payload?.payload?.payload,
                        redirect: {
                            path: 'home',
                            condition: isSuccess,
                        },
                    },
                }),
            );
        }
    };

    const handleCancel = async () => {
        if (activeTab == 0) {
            dispatch(
                switchActiveTab({
                    activeTab: 'athleteList',
                }),
            );
            dispatch(breadCrumpPop());
            router.navigate('home', { replace: true });
        } else {
            handleTabSwitch(false);
        }
    };

    const formControls = {
        activeTab,
        setAthleteData,
        isModal: false,
        defaultValues: athleteData,
        handleCancel,
        handleSave,
    };

    const pagesMapping = {
        0: <EditAthleteProfile {...formControls} />,
        1: <EditAthletePersonalInfo {...formControls} nationality={athleteData?.nationality} />,
        2: <EditMedicalInfo {...formControls} />,
    };

    return (
        <Theme.Body>
            <Theme.TableTitle value={trans('addAthlete.title')} variant="h3" />

            <Theme.TableTabsWrapper>
                {tableTabsData &&
                    tableTabsData.map((name, index) => (
                        <Theme.TableTab
                            key={`HeadBox item: ${index}`}
                            $isActive={activeTab === index}
                        >
                            {trans(`addAthlete.${name}`)}
                        </Theme.TableTab>
                    ))}
            </Theme.TableTabsWrapper>

            <Theme.TableUnderline />

            {pagesMapping[activeTab]}
        </Theme.Body>
    );
};
