import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { SharedModal, MultiSelectController, SelectionCardController } from 'components';
import * as Theme from './theme';
import { Divider } from 'components/modal-windows';
import { useLocales } from 'hooks/locales';
import { useAddSportClubProfile } from 'services/hooks';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { toast } from 'react-toastify';

interface AddSportFormValues {
    sportName: string;
    sportProfileManager: { id: string };
    technicalDirector: { id: string };
}

export const UpdateClubInfoModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { trans } = useLocales();

    const { academy } = useSelector(selectAcademy);
    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm<AddSportFormValues>({
        defaultValues: {
            sportName: '',
            sportProfileManager: { id: '' },
            technicalDirector: { id: '' },
        },
    });

    const { refetch } = useClubList(academy.id);
    const { mutate: addSportClubProfile, isPending: isLoading } = useAddSportClubProfile({
        onSuccess: (response: any) => {
            refetch();
            setIsOpen(false);
            reset();
        },
        onError: (error: any) => {
            console.error('Error adding sport club profile', error);

            toast.error(trans('error.message'));
        },
    });

    const handleAddSport = (data: AddSportFormValues) => {
        addSportClubProfile({
            academyId: academy?.id,
            sportName: data.sportName,
            sportProfileManagerId: data.sportProfileManager.id,
            technicalDirectorId: data.technicalDirector.id,
        });
    };
    return (
        <>
            <Theme.ButtonPrimary onClick={() => setIsOpen(true)}>
                {trans('clubList.addNewClub')}
            </Theme.ButtonPrimary>

            <SharedModal
                isOpen={isOpen}
                onRequestClose={() => {
                    setIsOpen(false);
                    reset();
                }}
                title={trans('clubList.addNewClub')}
                footerContent={
                    <Theme.SubmitPrimary
                        onClick={handleSubmit(handleAddSport)}
                        disabled={isLoading}
                    >
                        {isLoading ? trans('loading') : trans('form.addSportProfileType.add')}
                    </Theme.SubmitPrimary>
                }
            >
                <SelectionCardController
                    control={control}
                    name="sport"
                    options={[
                        {
                            label: trans('sport.football'),
                            value: 'football',
                            icon: '/assets/icons/sports/football-icon.svg',
                        },
                        {
                            label: trans('sport.swimming'),
                            value: 'swimming',
                            icon: '/assets/icons/sports/swimming-icon.svg',
                        },
                        {
                            label: trans('sport.athletics'),
                            value: 'athletics',
                            icon: '/assets/icons/sports/athletics-icon.svg',
                        },
                    ]}
                />
                <Divider />

                <form onSubmit={handleSubmit(handleAddSport)}>
                    <Theme.Form>
                        <Theme.Field>
                            <Theme.Label>{trans('addNewSport.sportProfileManager')}</Theme.Label>
                            <MultiSelectController
                                control={control}
                                name="sportProfileManager"
                                options={[
                                    { label: 'Manager 1', value: 'manager1' },
                                    { label: 'Manager 2', value: 'manager2' },
                                ]}
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
                                options={[
                                    { label: 'Director 1', value: 'director1' },
                                    { label: 'Director 2', value: 'director2' },
                                ]}
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
