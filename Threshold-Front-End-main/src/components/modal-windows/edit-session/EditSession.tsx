import React from 'react';
import { useLocales } from 'hooks/locales';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { arrayToSelectOptions, selectOptionsToValues } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { MultiSelectController } from 'components/multi-selection';
import { PlayingSessionStatus } from 'libs/enums';
import { useEditSessionSchema } from 'schemas/team/editSession';
import { closeModal, setModalContent } from 'store/controlsSlice';
import { sessionAPIs } from 'services/apis';
import CurrentTeamRecords from './CurrentTeamRecords';
import CurrentSessionRecords from './CurrentSessionRecords';

export const EditSession: React.FC<
    FormWindowProps & FormControlsProps & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();
    const { defaultValues, id: teamId } = props;

    const { academy, currentSession, currentSessionRecords, currentTeam } =
        useSelector(selectAcademy);

    const editSessionSchema = useEditSessionSchema([]);
    const methods = useForm({
        mode: 'all',
        resolver: yupResolver(editSessionSchema),
        defaultValues: defaultValues || {},
    });

    const handleSave = async () => {
        try {
            if (teamId && academy?.id) {
                let response = {} as any;

                if (currentSessionRecords?.length) {
                    const formData = selectOptionsToValues(methods.getValues(), [
                        'status',
                        ...currentSessionRecords.reduce(
                            (acc, { id }) => [...acc, `status@${id}`],
                            [] as string[],
                        ),
                    ]);

                    response = await dispatch(
                        sessionAPIs.updateSession(currentSession.id)(formData),
                    );
                } else {
                    const formData = selectOptionsToValues(methods.getValues(), [
                        'status',
                        ...(currentTeam?.athletes || []).reduce(
                            (acc, { id }) => [...acc, `status@${id}`],
                            [] as string[],
                        ),
                    ]);

                    response = await dispatch(
                        sessionAPIs.createRecordSession(currentSession.id)({
                            ...formData,
                            team: teamId,
                            academy: academy?.id,
                        }),
                    );
                }

                const isSuccess = [201, 200].includes(response?.payload?.status);

                dispatch(
                    setModalContent({
                        modalContent: {
                            type: isSuccess ? 'success' : 'warning',
                            title: isSuccess ? 'Success' : 'Warning',
                            subtitle: isSuccess
                                ? 'Session data have been updated'
                                : response?.payload?.payload?.message,
                        },
                    }),
                );

                setTimeout(() => {
                    dispatch(closeModal());
                }, 3000);
            }
        } catch (error) {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Error occurred',
                        subtitle: '',
                    },
                }),
            );
        }
    };

    return (
        <Body>
            <FormProvider {...methods}>
                <FormRow
                    title={trans('session.status')}
                    content={
                        <MultiSelectController
                            {...{
                                control: methods.control,
                                name: 'status',
                                options: arrayToSelectOptions({ array: PlayingSessionStatus }),
                                transSuffix: 'session.',
                                menuPlacement: 'bottom',
                            }}
                        />
                    }
                />
                <Divider />

                {currentSessionRecords?.length > 0 ? (
                    <CurrentSessionRecords />
                ) : (
                    <CurrentTeamRecords />
                )}

                <FormRow
                    content={
                        <ButtonsControls
                            isValid={methods.formState.isValid}
                            handleSave={handleSave}
                        />
                    }
                />
            </FormProvider>
        </Body>
    );
};
