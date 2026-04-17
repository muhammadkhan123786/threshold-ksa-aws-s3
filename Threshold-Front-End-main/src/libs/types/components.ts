export type TextVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span';

export type ModalContentType = {
    title: string;
    subtitle: string;
    defaults?: { [key: string]: any };
    redirect?: {
        path: string;
        id?: string;
        condition: boolean;
    };
    type:
        | 'none'
        | 'success'
        | 'warning'
        | 'info'
        | 'editAthleteProfile'
        | 'updateSubscription'
        | 'editAthletePersonalInfo'
        | 'documentUploadForm'
        | 'editCoachPersonalInfo'
        | 'editCoachProfile'
        | 'editSportProfileType'
        | 'editMedicalInfo'
        | 'editAtheleteRecord'
        | 'addAtheleteRecord'
        | 'editAthleteHealthRecord'
        | 'bankDataForm'
        | 'clothingDataForm'
        | 'emergencyContactForm'
        | 'personalInfoForm'
        | 'medicalInfoForm'
        | 'editTeamInfo'
        | 'editSession'
        | 'addBodyComposition'
        | 'addFitnessBattery'
        | 'addSportProfileType'
        | 'addSession'
        | 'addNewLink'
        | 'editBranchProfile'
        | 'editBranchProfileInfo'
        | 'editAdminManagerInfo'
        | 'addExamSession'
        | 'addWeeklySession'
        | 'addWeeklySessionPlanning'
        | 'localDocumentUploadForm';
};
