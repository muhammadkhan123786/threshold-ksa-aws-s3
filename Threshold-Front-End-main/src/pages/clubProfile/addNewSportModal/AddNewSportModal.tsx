import React, { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { SharedModal, MultiSelectController, SelectionCardController } from 'components';
import * as Theme from './theme';
import { Divider } from 'components/modal-windows';
import { useLocales } from 'hooks/locales';
import { useAddSportClubProfile } from 'services/hooks';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { toast } from 'react-toastify';
import { useFetchManagersTable } from 'services/hooks/manager/useFetchManagersTable';
import { SharedButton } from 'components/sharedButton';
import { useSportOptions } from 'libs/utils/sportOptions';
import { SaveLoaderButton } from 'components/saveLoaderButton';
import { some } from 'lodash';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAddNewSportSchema } from './useAddNewSportSchema';

interface AddSportFormValues {
    sport: { label: string; value: string };
    sportProfileManager: { label: string; value: string };
    technicalDirector: { label: string; value: string };
}
interface ClubListProps {
    clubs: any;
}

export const AddNewSportModal: React.FC<ClubListProps> = ({ clubs }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { trans } = useLocales();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { academy } = useSelector(selectAcademy);
    const sportOptions = useSportOptions();
    const schema = useAddNewSportSchema();

    const {
        handleSubmit,
        control,
        reset,
        watch,
        formState: { errors },
    } = useForm<AddSportFormValues>({
        mode: 'all',
        defaultValues: {
            sport: { label: '', value: '' },
            sportProfileManager: { label: '', value: '' },
            technicalDirector: { label: '', value: '' },
        },
        resolver: yupResolver(schema),
    });

    const { data, refetch } = useClubList(academy.id);
    const { mutate: addSportClubProfile, isPending: isLoading } = useAddSportClubProfile({
        onSuccess: (response: any) => {
            refetch();
            setIsOpen(false);
            reset();
        },
        onError: (error: any) => {
            console.error('Error adding sport club profile', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error(trans('error.message'));
            }
        },
    });
    const {
        data: managerData,
        isLoading: isManagerLoading,
        error: managerError,
    } = useFetchManagersTable(academy.id, page, limit);
    const handleAddSport = (data: AddSportFormValues) => {
        addSportClubProfile({
            academyId: academy?.id,
            sportName: data.sport.value,
            sportProfileManagerId: data.sportProfileManager.value,
            technicalDirectorId: data.technicalDirector.value,
        });
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        reset();
    };

    return (
        <>
            <Theme.ButtonPrimary onClick={() => setIsOpen(true)}>
                {trans('clubList.addNewClub')}
            </Theme.ButtonPrimary>

            <SharedModal
                isOpen={isOpen}
                onRequestClose={handleCloseModal}
                title={trans('clubList.addNewClub')}
                footerContent={
                    <SharedButton onClick={handleSubmit(handleAddSport)} loading={isLoading}>
                        {isLoading ? <SaveLoaderButton /> : trans('form.addSportProfileType.add')}
                    </SharedButton>
                }
            >
                <SelectionCardController
                    control={control}
                    name="sport"
                    options={sportOptions}
                    selectedOptions={data?.payload?.map((e: any) => e.sport)}
                />
                <Divider />
                <form onSubmit={handleSubmit(handleAddSport)}>
                    <Theme.Form>
                        <Theme.Field>
                            <Theme.Label>{trans('addNewSport.sportProfileManager')}</Theme.Label>
                            <MultiSelectController
                                control={control}
                                name="sportProfileManager"
                                options={
                                    managerData?.data?.map((person: any) => ({
                                        label: `${person.firstName} ${person.lastName}`,
                                        value: person.id,
                                    })) || []
                                }
                            />
                            {errors.sportProfileManager && (
                                <Theme.ErrorText>
                                    {errors.sportProfileManager.message}
                                </Theme.ErrorText>
                            )}
                        </Theme.Field>

                        <Theme.Field>
                            <Theme.Label>{trans('addNewSport.technicalDirector')}</Theme.Label>
                            <MultiSelectController
                                control={control}
                                name="technicalDirector"
                                options={
                                    managerData?.data?.map((person: any) => ({
                                        label: `${person.firstName} ${person.lastName}`,
                                        value: person.id,
                                    })) || []
                                }
                            />

                            {errors.technicalDirector && (
                                <Theme.ErrorText>
                                    {errors.technicalDirector.message}
                                </Theme.ErrorText>
                            )}
                        </Theme.Field>
                    </Theme.Form>
                </form>
            </SharedModal>
        </>
    );
};
