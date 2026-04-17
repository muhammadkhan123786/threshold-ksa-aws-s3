import { Dispatch, SetStateAction } from 'react';
import { AnyAction } from 'redux';
import { athleteAPIs, authAPIs, coachAPIs, teamAPIs } from 'services/apis';
import { ModalContentType } from 'libs/types';
import { closeModal, setModalContent } from 'store/controlsSlice';
import { useFetchAthelteRecordById } from 'services/hooks/athlete/useFetchAtheleteRecordById';

export const fireAlert = (content: ModalContentType, dispatch: Dispatch<AnyAction>) => {
    dispatch(
        setModalContent({
            modalContent: content,
        }),
    );
};

export const handleDeleteCoach = async (
    coachId: string,
    dispatch: any,
    setLoading: Dispatch<SetStateAction<boolean>>,
) => {
    try {
        setLoading(true);

        const response: any = await dispatch(coachAPIs.deleteCoach(coachId)({}));

        const isSuccess = [200, 204].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: !isSuccess ? 'warning' : 'success',
                    title: !isSuccess ? 'Error' : 'Success',
                    subtitle: !isSuccess
                        ? response?.payload?.message || 'Failed to delete coach'
                        : 'Coach has been deleted successfully',
                },
            }),
        );

        return response;
    } catch (error: any) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: error.message,
            },
            dispatch,
        );
        return error;
    } finally {
        setLoading(false);
    }
};

export const handleEditSubscription = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    athleteId: string,
) => {
    try {
        const response: any = await dispatch(
            athleteAPIs.updateAthleteSubscription(athleteId)({ ...formData }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: !isSuccess ? 'warning' : 'success',
                    title: !isSuccess ? 'Error' : 'Success',
                    subtitle: !isSuccess
                        ? response?.payload?.payload?.payload
                        : 'Athlete subscription data has been updated',
                },
            }),
        );

        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleEditAthlete = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    athleteId: string,
) => {
    try {
        const response: any = await dispatch(
            athleteAPIs.updateAthlete(athleteId)({
                ...formData,
            }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: !isSuccess ? 'warning' : 'success',
                    title: !isSuccess ? 'Error' : 'Success',
                    subtitle: !isSuccess
                        ? response?.payload?.payload?.payload
                        : 'Athlete data has been updated',
                },
            }),
        );

        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleEditAthleteRecord = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    refetchAthleteRecord: () => void,
    athleteId: string,
    recordId: string,
) => {
    try {
        const response: any = await dispatch(
            athleteAPIs.updateAthleteRecord(
                athleteId,
                recordId,
            )({
                ...formData,
            }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: !isSuccess ? 'warning' : 'success',
                    title: !isSuccess ? 'Error' : 'Success',
                    subtitle: !isSuccess
                        ? response?.payload?.payload?.payload
                        : 'Athlete record data has been updated',
                },
            }),
        );

        if (isSuccess) {
            refetchAthleteRecord();
        }
        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleAddAthleteRecord = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    refetchAthleteRecord: () => void,
    athleteId: string,
) => {
    try {
        const response: any = await dispatch(
            athleteAPIs.addAthleteRecord(athleteId)({
                ...formData,
            }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: !isSuccess ? 'warning' : 'success',
                    title: !isSuccess ? 'Error' : 'Success',
                    subtitle: !isSuccess
                        ? response?.payload?.payload?.payload
                        : 'Athlete record data has been updated',
                },
            }),
        );

        if (isSuccess) {
            refetchAthleteRecord();
        }
        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleDeleteAthlete = async (
    athleteId: string,
    dispatch: any,
    setLoading: Dispatch<SetStateAction<boolean>>,
) => {
    try {
        setLoading(true);

        const response: any = await dispatch(athleteAPIs.deleteAthlete(athleteId)({}));

        const isSuccess = [200, 204].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: !isSuccess ? 'warning' : 'success',
                    title: !isSuccess ? 'Error' : 'Success',
                    subtitle: !isSuccess
                        ? response?.payload?.message || 'Failed to delete athlete'
                        : 'Athlete has been deleted successfully',
                },
            }),
        );

        return response;
    } catch (error: any) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: error.message,
            },
            dispatch,
        );
        return error;
    } finally {
        setLoading(false);
    }
};

export const handleSportProfileActions = async (
    id: string,
    formData: any,
    dispatch: Dispatch<AnyAction>,
    isEdit: boolean,
) => {
    try {
        const { status, sport, athleteId, ...rest } = formData;
        const data = { status, sport, athlete: athleteId, ...rest };

        const response: any = await dispatch(
            isEdit
                ? athleteAPIs.updateSportProfileType(id)(data)
                : athleteAPIs.createSportProfileType()(data),
        );

        fireAlert(
            {
                type: response.error ? 'warning' : 'success',
                title: response.error ? 'Error' : 'Success',
                subtitle: response.error
                    ? response?.payload?.payload?.payload
                    : `Athlete profile has been ${isEdit ? 'edited' : 'created'}`,
            },
            dispatch,
        );

        // setTimeout(() => {
        //     dispatch(closeModal());
        // }, 2000);

        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleEditCoach = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    coachId: string,
) => {
    try {
        const response: any = await dispatch(
            coachAPIs.updateCoach(coachId)({
                ...formData,
            }),
        );

        fireAlert(
            {
                type: response.error ? 'warning' : 'success',
                title: response.error ? 'Error' : 'Success',
                subtitle: response.error
                    ? response?.payload?.payload?.payload
                    : 'Coach data has been updated',
            },
            dispatch,
        );

        setTimeout(() => {
            dispatch(closeModal());
        }, 2000);

        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleEditTeam = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    teamId: string,
) => {
    try {
        const response: any = await dispatch(
            teamAPIs.updateTeam(teamId)({
                ...formData,
            }),
        );

        fireAlert(
            {
                type: response.error ? 'warning' : 'success',
                title: response.error ? 'Error' : 'Success',
                subtitle: response.error
                    ? response?.payload?.payload?.payload
                    : 'Team data has been updated',
            },
            dispatch,
        );

        setTimeout(() => {
            dispatch(closeModal());
        }, 2000);

        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};

export const handleEditUser = async (
    formData: any,
    dispatch: Dispatch<AnyAction>,
    userId: string,
) => {
    try {
        const response: any = await dispatch(
            authAPIs.updateUser(userId)({
                ...formData,
            }),
        );

        fireAlert(
            {
                type: response.error ? 'warning' : 'success',
                title: response.error ? 'Error' : 'Success',
                subtitle: response.error
                    ? response?.payload?.payload?.payload
                    : 'User data has been updated',
            },
            dispatch,
        );

        setTimeout(() => {
            dispatch(closeModal());
        }, 2000);

        return response;
    } catch (error) {
        fireAlert(
            {
                type: 'warning',
                title: 'Error occurred',
                subtitle: '',
            },
            dispatch,
        );
        return error;
    }
};
