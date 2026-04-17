import React, { useState, useEffect } from 'react';
import { SharedModal } from '../sharedModal';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import { Controller, useForm } from 'react-hook-form';
import { useRouter } from 'react-router5';
import { useDispatch, useSelector } from 'react-redux';
import { FormRow } from 'components/modal-windows/FormRow';
import { MultiSelectController } from 'components/multi-selection';
import { Gender } from 'libs/enums/athlete';
import { arrayToSelectOptions } from 'libs/helpers';
import { InputDateController } from 'components/inputDate';
import { LabelInput } from 'components/labelInput';
import { FilePickerController } from 'components/filePicker/FilePickerController';
import { useFetchAdministratorsTable } from 'services/hooks/administrator/useFetchAdministratorsTable';
import { useFetchCoachesTable } from 'services/hooks/getForSelect/useFetchClubCoaches';
import { useFetchPlayersTable } from 'services/hooks/players/useFetchPlayersTable';
import { AddTeamsRequest, useAddTeams, useUpdateTeam } from 'services/hooks/teams/useAddTeamsList';
import { setModalContent } from 'store/controlsSlice';
import { useNewTeamSchema } from 'schemas/team/teamsValidationSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { InputController } from 'components/input';
import { useFetchTeamsTable } from 'services/hooks/teams/useFetchTeamsList';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { SharedButton } from 'components/sharedButton';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { selectAcademy } from 'store';
import { Category, SkillType } from 'libs/enums';
import { useFetchClubTeamsIdDetails } from 'services/hooks/teams/useFetchClubTeamsIdDetails';

interface SizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    teamDetails?: any;
}

export const TeamsModal: React.FC<SizeModalProps> = ({ isOpen, onClose, teamDetails }) => {
    const { trans } = useLocales();
    const customHeight = '100%';
    const dispatch = useDispatch();
    const [isReordered, setIsReordered] = useState(false);
    const [showWarning, setShowWarning] = useState(false);
    const router = useRouter();
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const handleModalClose = () => {
        if (isReordered) {
            setShowWarning(true);
        } else {
            onClose();
            reset();
        }
    };

    const [adminSearch, setAdminSearch] = useState('');
    const [coachSearch, setCoachSearch] = useState('');
    const [subCoachSearch, setsubCoachSearch] = useState('');
    const [playersSearch, setPlayersSearch] = useState('');
    const [limit, setlimit] = useState(50);
    const [page, setPage] = useState(1);
    const [isSubmittingForm, setIsSubmittingForm] = useState(false);
    const teamsSchema = useNewTeamSchema();
    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors },
    } = useForm<any>({
        mode: 'all',
        resolver: yupResolver(teamsSchema),
        defaultValues: {
            name: '',
            ageOfPlayers: '',
            coach: null,
            admin: null,
            subCoaches: [],
            athletes: [],
            background: null,
            logo: null,
            category: null,
            gender: null,
        },
    });
    const { refetch } = useFetchTeamsTable(sportId, 1, 10);
    const { refetch: TeamDetailsRefetch } = useFetchClubTeamsIdDetails(sportId, id);
    const {
        data: administratorsData,
        isLoading: administratorsDataLoading,
        error: administratorsLoading,
    } = useFetchAdministratorsTable(sportId, page, limit, adminSearch);
    const formattedAdministratorsData =
        administratorsData?.payload?.items?.map((admin: any) => ({
            value: admin.id,
            label: `${admin.firstName} ${admin.lastName}`,
        })) || [];

    const {
        data: coachesData,
        isLoading: coachesLoading,
        error: coachesError,
    } = useFetchCoachesTable(sportId, page, limit, coachSearch);
    const formattedcoachesData =
        coachesData?.payload?.items?.map((coache: any) => ({
            value: coache.id,
            label: `${coache.firstName} ${coache.lastName}`,
        })) || [];

    const {
        data: subcoachesData,
        isLoading: subcoachesLoading,
        error: subcoachesError,
    } = useFetchCoachesTable(sportId, page, limit, subCoachSearch);
    const formattedSubcoachesData =
        subcoachesData?.payload?.items?.map((coache: any) => ({
            value: coache.id,
            label: `${coache.firstName} ${coache.lastName}`,
        })) || [];

    const {
        data: playersData,
        isLoading: playersLoading,
        error: playersError,
    } = useFetchPlayersTable(sportId, page, limit, playersSearch);
    const formattPlayersData =
        playersData?.data?.map((players: any) => ({
            value: players.id,
            label: `${players.firstName} ${players.lastName}`,
        })) || [];
    useEffect(() => {
        if (teamDetails) {
            const genderDataValue = Object.values(Category).find(
                (option) => option === teamDetails?.gender,
            );
            const categoryDataValue = Object.values(SkillType).find(
                (option) => option === teamDetails?.category,
            );
            const AdminDataValue = Object.values(SkillType).find(
                (option) => option === teamDetails?.category,
            );
            reset({
                name: teamDetails.name,
                gender: genderDataValue,
                category: categoryDataValue,
            });
        }
    }, [teamDetails, reset]);
    const { mutateAsync: AddTeams } = useAddTeams(sportId);
    const { mutateAsync: UpdateTeam } = useUpdateTeam(sportId, id);
    const handleSave = async (data: any) => {
        setIsSubmittingForm(true);

        try {
            const payload = {
                ageOfPlayers: data.ageOfPlayers,
                name: data.name,
                coach: data.coach.value,
                admin: data.admin.value,
                subCoaches: data.subCoaches
                    ? data.subCoaches.map((item: any) => item.value).join(',')
                    : '',
                athletes: data.athletes
                    ? data.athletes.map((item: any) => item.value).join(',')
                    : '',
                background: data.background,
                logo: data.logo,
                category: data.category.value,
                gender: data.gender.value,
            } as AddTeamsRequest;

            if (id) {
                await UpdateTeam(payload);
            } else {
                await AddTeams(payload);
            }

            refetch();
            TeamDetailsRefetch();

            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'success',
                        title: trans('form.success'),
                        subtitle: trans('manager.created_successfully'),
                    },
                }),
            );
            reset();
            watch();
            onClose();
        } catch (error: any) {
            console.error('Error occurred while saving administrator:', error);
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: trans('form.warning'),
                        subtitle: trans(error),
                    },
                }),
            );
        } finally {
            setIsSubmittingForm(false); // Reset loading state
        }
    };
    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.teams'), path: 'teams', params: { sportId } },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <>
            <SharedModal
                isOpen={isOpen}
                customHeight={customHeight}
                onRequestClose={handleModalClose}
                title={trans(id ? 'edit.teams' : 'add.teams')}
            >
                <Theme.LineHR />
                <Theme.Body>
                    <Theme.EvenWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', display: 'block', color: '#7d7d7d' }}
                                title={trans('label.teams.ageOfPlayers')}
                                content={
                                    <InputDateController
                                        {...{
                                            control,
                                            name: 'ageOfPlayers',
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.FullWidthInputsWrapperTwoInputs>
                        <Theme.InputsWrapper>
                            <LabelInput label={trans('label.teams.teamName')} />
                            <Controller
                                control={control}
                                name="name"
                                render={({ field, fieldState }) => (
                                    <>
                                        <InputController
                                            {...field}
                                            control={control}
                                            type="name"
                                            placeholder={trans('placeholder.name')}
                                        />
                                    </>
                                )}
                            />
                        </Theme.InputsWrapper>
                    </Theme.FullWidthInputsWrapperTwoInputs>
                    <Theme.FullWidthInputsWrapperTwoInputs>
                        <FormRow
                            style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                            title={trans('label.gender')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control: control,
                                        name: 'gender',
                                        options: arrayToSelectOptions({ array: Category }),
                                        menuPlacement: 'bottom',
                                        transSuffix: 'category.',
                                    }}
                                />
                            }
                        />
                        <FormRow
                            style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                            title={trans('label.category')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control: control,
                                        name: 'category',
                                        options: arrayToSelectOptions({ array: SkillType }),
                                        menuPlacement: 'bottom',
                                        transSuffix: 'category.',
                                    }}
                                />
                            }
                        />
                    </Theme.FullWidthInputsWrapperTwoInputs>
                    <Theme.EvenWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.teams.coach')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'coach',
                                            options: formattedcoachesData,
                                            onInputChange: (inputValue: string) =>
                                                setCoachSearch(inputValue),
                                            menuPlacement: 'bottom',
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                                title={trans('label.teams.admin')}
                                content={
                                    <MultiSelectController
                                        {...{
                                            control,
                                            name: 'admin',
                                            options: formattedAdministratorsData,
                                            menuPlacement: 'bottom',
                                            onInputChange: (inputValue: string) =>
                                                setAdminSearch(inputValue),
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                    </Theme.EvenWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <FormRow
                            style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                            title={trans('label.teams.subCoaches')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control,
                                        name: 'subCoaches',
                                        isMulti: true,
                                        options: formattedSubcoachesData,
                                        onInputChange: (inputValue: string) =>
                                            setsubCoachSearch(inputValue),
                                        menuPlacement: 'bottom',
                                    }}
                                />
                            }
                        />
                    </Theme.FullWidthInputsWrapper>
                    <Theme.FullWidthInputsWrapper>
                        <FormRow
                            style={{ fontSize: '14px', color: '#777777', display: 'block' }}
                            title={trans('label.teams.player')}
                            content={
                                <MultiSelectController
                                    {...{
                                        control,
                                        name: 'athletes',
                                        isMulti: true,
                                        options: formattPlayersData,
                                        onInputChange: (inputValue: string) =>
                                            setPlayersSearch(inputValue),
                                        menuPlacement: 'bottom',
                                    }}
                                />
                            }
                        />
                    </Theme.FullWidthInputsWrapper>
                    <Theme.EvenWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.teams.logo')}
                                content={
                                    <FilePickerController
                                        {...{
                                            control,
                                            name: 'logo',
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                        <Theme.FullWidthInputsWrapper>
                            <FormRow
                                style={{
                                    fontSize: '14px',
                                    color: '#777777',
                                    display: 'block',
                                }}
                                title={trans('label.teams.background')}
                                content={
                                    <FilePickerController
                                        {...{
                                            control,
                                            name: 'background',
                                        }}
                                    />
                                }
                            />
                        </Theme.FullWidthInputsWrapper>
                    </Theme.EvenWrapper>
                </Theme.Body>
                <Theme.FooterButtonsWrapper>
                    <SharedButton onClick={handleSubmit(handleSave)}>
                        <>{isSubmittingForm ? <SaveLoaderButton /> : trans('button.save')}</>
                    </SharedButton>
                </Theme.FooterButtonsWrapper>
            </SharedModal>
        </>
    );
};
