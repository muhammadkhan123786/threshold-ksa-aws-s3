import React, { Dispatch, SetStateAction, useCallback, useMemo, useEffect } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { useForm } from 'react-hook-form';
import { InputController } from 'components/input';
import { Nationality, Relationship } from 'libs/enums';
import { FormControlsProps, FormRow, FormWindowProps } from '../FormRow';
import { Body, Divider } from '../Theme';
import { arrayToSelectOptions, handleEditAthlete, selectOptionsToValues } from 'libs/helpers';
import { MultiSelectController } from 'components/multi-selection';
import { InputFileController } from 'components/inputFile';
import { getAvatarPlaceholder } from 'libs/constants';
import { yupResolver } from '@hookform/resolvers/yup';
import ButtonsControls from '../ButtonsControls';
import { useDispatch } from 'react-redux';
import { EDIT_ATHLETE_PROFILE_DEFAULTS, useEditAthleteProfileSchema } from 'schemas';
import { setModalContent } from 'store/controlsSlice';

export const EditAthleteProfile: React.FC<
    FormWindowProps &
        FormControlsProps & {
            id?: string;
            setAthleteData?: Dispatch<SetStateAction<{ [key: string]: any } | null>>;
        } & React.HTMLAttributes<HTMLDivElement>
> = (props) => {
    const { trans } = useLocales();
    const {
        defaultValues,
        isModal,
        activeTab,
        handleSave,
        id: athleteId,
        setAthleteData,
        handleCancel,
    } = props;
    const dispatch = useDispatch();

    const editAthleteProfileSchema = useEditAthleteProfileSchema();
    const {
        formState: { isValid, touchedFields },
        control,
        getValues,
        trigger,
        watch,
    } = useForm({
        mode: 'all',
        resolver: yupResolver(editAthleteProfileSchema),
        defaultValues: defaultValues || EDIT_ATHLETE_PROFILE_DEFAULTS,
    });

    const selectIsValid = useMemo(
        () => !!watch('relationship') && !!watch('nationality'),
        [watch('relationship'), watch('nationality')],
    );

    const handleWindowSave = async () => {
        if (isModal && athleteId) {
            await handleEditAthlete(
                selectOptionsToValues(getValues(), ['relationship', 'nationality']),
                dispatch,
                athleteId,
            );
        } else {
            setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));

            setTimeout(
                async () => {
                    handleSave && (await handleSave());
                },
                activeTab === 2 ? 2000 : 100,
            );
        }
    };

    useEffect(() => {
        setAthleteData && setAthleteData((prev) => ({ ...prev, ...getValues() }));
    }, [touchedFields]);

    return (
        <Body>
            {/* name */}
            <FormRow
                title={trans('form.editAthleteProfile.name')}
                content={
                    <Theme.NameInputsWrapper>
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'firstName',
                                placeholder: trans('form.enterFirstName'),
                            }}
                        />
                        <InputController
                            type="text"
                            {...{
                                control,
                                name: 'lastName',
                                placeholder: trans('form.enterLastName'),
                            }}
                        />
                    </Theme.NameInputsWrapper>
                }
            />
            <Divider />

            {/* avatar */}
            <FormRow
                title={trans('form.editAthleteProfile.athletePhoto')}
                subtitle={trans('form.editAthleteProfile.athletePhotoSubtitle')}
                content={
                    <InputFileController
                        {...{
                            control,
                            trigger,
                            name: 'avatar',
                            contents: (
                                <Theme.UploadText>
                                    <span>{trans('form.editAthleteProfile.uploadText1')}</span>
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

            {/* emergency contact */}
            <FormRow
                title={trans('form.editAthleteProfile.emergency')}
                subRows={[
                    {
                        title: trans('form.editAthleteProfile.relationship'),
                        content: (
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'relationship',
                                    options: arrayToSelectOptions({ array: Relationship }),
                                    transSuffix: 'form.editAthleteProfile.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        ),
                    },
                    {
                        title: trans('form.editAthleteProfile.contactNumber'),
                        content: (
                            <InputController
                                {...{
                                    control,
                                    name: 'contactNumber',
                                }}
                            />
                        ),
                    },
                ]}
            />
            <Divider />

            {/* nationality */}
            <FormRow
                title={trans('form.editAthleteProfile.nationality')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'nationality',
                            options: arrayToSelectOptions({ array: Nationality }),
                            transSuffix: 'form.editAthleteProfile.',
                            menuPlacement: 'top',
                        }}
                    />
                }
            />
            {/* buttons */}
            <FormRow
                content={
                    <ButtonsControls
                        isValid={isValid && selectIsValid}
                        handleSave={handleWindowSave}
                        handleCancel={handleCancel}
                        saveText={isModal ? 'form.save' : 'form.next'}
                        cancelText={isModal || activeTab === 0 ? 'form.cancel' : 'form.back'}
                    />
                }
            />
        </Body>
    );
};
