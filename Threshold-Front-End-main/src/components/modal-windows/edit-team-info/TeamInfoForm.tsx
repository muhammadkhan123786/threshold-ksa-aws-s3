import { InputDateController } from 'components/inputDate';
import { FormRow } from '../FormRow';
import {
    Control,
    UseFormGetValues,
    UseFormSetValue,
    UseFormTrigger,
    UseFormWatch,
} from 'react-hook-form';
import { Divider } from '../Theme';
import { MultiSelectController } from 'components/multi-selection';
import { arrayToSelectOptions } from 'libs/helpers';
import { SportProfileType } from 'libs/enums';
import { InputController } from 'components/input';
import { useLocales } from 'hooks/locales';
import { Academy, Athlete, Coach } from 'libs/types';
import { useEffect } from 'react';
import { InputFileController } from 'components/inputFile';
import * as Theme from './Theme';

interface Props {
    control: Control<any, any>;
    defaultValues?: { [key: string]: any };
    academy: Academy;
    coaches: Coach[];
    athletes: Athlete[];
    setValue?: UseFormSetValue<any>;
    getValues: UseFormGetValues<any>;
    trigger: UseFormTrigger<any>;
    watch?: UseFormWatch<any>;
    flag?: string;
}

export const TeamInfoForm = ({
    control,
    academy,
    coaches,
    getValues,
    trigger,
    athletes,
    watch,
    setValue,
    flag,
}: Props) => {
    const { trans } = useLocales();

    const filteredAthletes =
        !watch || watch('sport') === ''
            ? athletes
            : athletes.filter(({ teams }) =>
                  !teams || teams?.length === 0
                      ? true
                      : teams?.filter(({ sport }) =>
                            watch('sport') && watch('sport').value
                                ? sport !== watch('sport').value
                                : true,
                        ).length > 0,
              );

    const filteredCoaches =
        !watch || watch('sport') === ''
            ? coaches
            : coaches.filter(({ sport }) =>
                  watch('sport') && watch('sport').value ? sport === watch('sport').value : true,
              );

    useEffect(() => {
        if (watch && setValue) {
            setValue('coach', {});
            setValue('athletes', []);
        }
    }, [watch && watch('sport')]);

    return (
        <>
            {/* logo */}
            {!flag && (
                <>
                    <FormRow
                        title={trans('form.editAthleteProfile.teamPhoto')}
                        content={
                            <InputFileController
                                {...{
                                    control,
                                    trigger,
                                    name: 'logo',
                                    contents: (
                                        <Theme.UploadText>
                                            <span>
                                                {trans('form.editAthleteProfile.uploadText1')}
                                            </span>
                                            {trans('form.editAthleteProfile.uploadText2')}
                                            <br />
                                            {trans('form.editAthleteProfile.uploadText3')}
                                        </Theme.UploadText>
                                    ),
                                }}
                            />
                        }
                    />
                    <Divider />
                    <FormRow
                        title={trans('form.addTeam.creationDate')}
                        content={
                            <InputDateController
                                {...{
                                    control,
                                    name: 'creationDate',
                                    withPortal: true,
                                }}
                            />
                        }
                    />
                    <Divider />
                    <FormRow
                        title={trans('form.addTeam.name')}
                        content={
                            <InputController
                                {...{
                                    control,
                                    name: 'name',
                                }}
                            />
                        }
                    />
                    <Divider />
                    <FormRow
                        title={trans('form.addTeam.sportProfile')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'sport',
                                    options: arrayToSelectOptions({ array: SportProfileType }),
                                    transSuffix: 'sport.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                    <Divider />
                    <FormRow
                        title={trans('form.addTeam.coach')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'coach',
                                    autocomplete: 'coach',
                                    options: filteredCoaches.map((coach) => ({
                                        label: `${coach.firstName} ${coach.lastName}`,
                                        value: coach.id,
                                    })),
                                    menuPlacement: 'top',
                                }}
                            />
                        }
                    />
                </>
            )}
            <Divider />

            <FormRow
                title={trans('form.addTeam.athletes')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'athletes',
                            autocomplete: 'athletes',
                            options: filteredAthletes.map((athlete) => ({
                                label: `${athlete.firstName} ${athlete.lastName}`,
                                value: athlete.id,
                            })),
                            isMulti: true,
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />
        </>
    );
};
