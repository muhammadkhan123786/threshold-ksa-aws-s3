import { useForm } from 'react-hook-form';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNewTeamSchema } from 'schemas';
import { FormRow } from 'components/modal-windows/FormRow';
import { TeamInfoForm } from 'components/modal-windows';
import { selectOptionsToValues } from 'libs/helpers';
import { useDispatch, useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useGetAthletes } from 'hooks';
import { Athlete, Coach } from 'libs/types';
import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { useGetCoaches } from 'hooks/data/useGetCoaches';
import { teamAPIs } from 'services/apis';
import { router } from 'routers';
import { setModalContent } from 'store/controlsSlice';

export const AddTeamPage = () => {
    const { trans } = useLocales();
    const { academy } = useSelector(selectAcademy);
    const { data: athletes } = useGetAthletes<Athlete[]>({ idType: 'academy', page: 0 });
    const { data: coaches } = useGetCoaches<Coach[]>({ idType: 'academy', page: 0 });
    const dispatch = useDispatch();

    const newTeamSchema = useNewTeamSchema();
    const {
        formState: { isValid },
        control,
        getValues,
        setValue,
        watch,
        trigger,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(newTeamSchema),
    });

    const handleSave = async () => {
        const formData = selectOptionsToValues(getValues(), ['branch', 'coach', 'sport']);

        const response = await dispatch(
            teamAPIs.createTeam()({
                ...formData,
                academy: academy.id,
                athletes: formData.athletes.map((athlete: any) => athlete.value),
            }),
        );

        const isSuccess = [201, 200].includes(response?.payload?.status);

        dispatch(
            setModalContent({
                modalContent: {
                    type: isSuccess ? 'success' : 'warning',
                    title: isSuccess ? 'Success' : 'Warning',
                    subtitle: isSuccess
                        ? 'Team has been created successfully'
                        : response?.payload?.payload?.payload,
                    redirect: {
                        path: 'home',
                        condition: isSuccess,
                    },
                },
            }),
        );
    };

    const handleCancel = async () => {
        router.navigate('home', { replace: true });
    };

    return (
        <Theme.Body>
            <Theme.TableTitle value={trans('form.addTeam.title')} variant="h2" />

            {!coaches ||
                (coaches?.length === 0 && (
                    <Theme.WarningMessage
                        value={trans('form.addTeam.warningMessage')}
                        variant="h2"
                    />
                ))}

            <TeamInfoForm
                watch={watch}
                setValue={setValue}
                getValues={getValues}
                control={control}
                academy={academy}
                athletes={athletes}
                coaches={coaches}
                trigger={trigger}
            />

            {/* buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid}
                        handleSave={handleSave}
                        handleCancel={handleCancel}
                    />
                }
            />
        </Theme.Body>
    );
};
