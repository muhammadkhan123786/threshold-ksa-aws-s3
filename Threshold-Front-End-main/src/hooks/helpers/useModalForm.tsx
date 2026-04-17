import {
    AddBodyComposition,
    AddFitnessBattery,
    EditMedicalInfo,
    EditAthletePersonalInfo,
    EditCoachPersonalInfo,
    SportProfileForm,
    EditAthleteProfile,
    EditCoachProfile,
    EditTeamInfo,
    AddSession,
    EditSession,
    PublicLinkForm,
    EditAtheleteRecord,
    AddAtheleteRecord,
    BankDataForm,
    ClothingDataForm,
    EmergencyContactForm,
    PersonalInfoForm,
    MedicalInfoForm,
    DocumentUploadForm,
    EditAthleteHealthRecord,
} from 'components/modal-windows';
import { ModalAlert } from 'components/modal';
import { useSelector } from 'react-redux';
import { selectAcademy, selectControls } from 'store';
import { useLocales } from 'hooks/locales';
import { UpdateAthleteSubscription } from 'components/modal-windows/update-athlete-subscription/UpdateAthleteSubscription';
import { AddBranchManager } from 'components/modal-windows/add-branch-manager/AddBranchManager';
import AddWeeklySessionPlanning from 'components/modal-windows/add-weekly-session-planning/AddWeeklySessionPlanning';
import { AddWeeklySession } from 'components/modal-windows/add-weekly-session/AddWeeklySession';
import { LocalDocumentUploadForm } from 'pages/public/AddAthlete/components/add-athlete-document/DocumentUploadForm';
import React from 'react';

interface ModalFormControls {
    defaultValues: any;
    isModal: boolean;
    id: string;
}

interface ModalMapping {
    [key: string]: React.ReactNode;
}

interface Props {
    id: string;
}

export const useModalForm = ({ id }: Props) => {
    const { modalContent } = useSelector(selectControls);
    const { currentAthlete } = useSelector(selectAcademy);
    const { trans } = useLocales();

    const formControls: ModalFormControls = {
        defaultValues: modalContent.defaults,
        isModal: true,
        id,
    };

    const modalMapping: ModalMapping = {
        none: <>nothing</>,
        success: <ModalAlert type="success" />,
        warning: <ModalAlert type="warning" />,
        info: <ModalAlert type="info" />,
        updateSubscription: <UpdateAthleteSubscription {...formControls} />,
        editAthleteProfile: <EditAthleteProfile {...formControls} />,
        editAthletePersonalInfo: (
            <EditAthletePersonalInfo
                {...formControls}
                nationality={{
                    label: trans(`form.editAthleteProfile.${currentAthlete?.nationality}`),
                    value: currentAthlete?.nationality,
                }}
            />
        ),
        documentUploadForm: <DocumentUploadForm {...formControls} />,
        editMedicalInfo: <EditMedicalInfo {...formControls} />,
        editAtheleteRecord: <EditAtheleteRecord {...formControls} />,
        addAtheleteRecord: <AddAtheleteRecord {...formControls} />,
        editAthleteHealthRecord: <EditAthleteHealthRecord {...formControls} />,
        bankDataForm: <BankDataForm {...formControls} />,
        clothingDataForm: <ClothingDataForm {...formControls} />,
        emergencyContactForm: <EmergencyContactForm {...formControls} />,
        personalInfoForm: <PersonalInfoForm {...formControls} />,
        medicalInfoForm: <MedicalInfoForm {...formControls} />,
        editSportProfileType: <SportProfileForm {...formControls} isEdit={true} />,
        editCoachPersonalInfo: <EditCoachPersonalInfo {...formControls} />,
        editCoachProfile: <EditCoachProfile {...formControls} />,
        editTeamInfo: <EditTeamInfo {...formControls} />,
        editSession: <EditSession {...formControls} />,
        addBodyComposition: <AddBodyComposition {...formControls} />,
        addFitnessBattery: <AddFitnessBattery {...formControls} />,
        addSportProfileType: <SportProfileForm {...formControls} isEdit={false} />,
        addSession: <AddSession {...formControls} />,
        addNewLink: <PublicLinkForm {...formControls} />,
        editBranchProfile: <PublicLinkForm {...formControls} />,
        editBranchProfileInfo: <PublicLinkForm {...formControls} />,
        editAdminManagerInfo: <AddBranchManager {...formControls} />,
        addWeeklySession: <AddWeeklySession {...formControls} />,
        addExamSession: null,
        localDocumentUploadForm: <LocalDocumentUploadForm {...formControls} />,
    };

    return {
        modalMapping,
    };
};
