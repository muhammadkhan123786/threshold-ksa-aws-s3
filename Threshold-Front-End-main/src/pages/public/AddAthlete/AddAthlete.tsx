import { router } from 'routers';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { InputController } from 'components/input';
import { MultiSelectController } from 'components/multi-selection';
import { InputDateController } from 'components/inputDate';
import {
    arrayToSelectOptions,
    selectOptionsToValues,
    getDateYearsFromNow,
    addMonths,
} from 'libs/helpers';
import {
    Nationality,
    Relationship,
    Education,
    Gender,
    PaymentMethod,
    YesNo,
    Consideration,
} from 'libs/enums';
import { setModalContent } from 'store/controlsSlice';
import { Divider } from 'components/modal-windows';
import { FormRow } from 'components/modal-windows/FormRow';
import { CHRONIC_DISEASES } from 'libs/constants';
import ButtonsControls from 'components/modal-windows/ButtonsControls';
import { InputFileController, Loader } from 'components';
import { useAthleteSchema } from './schema';
import { useCheckPublicAthleteLinkExists, usePostAthletePublic } from 'services/hooks';
import { useEffect } from 'react';
import { toast } from 'react-toastify';
import PersonalDocumentsSection from './components/personalDocumentsSection/PersonalDocumentsSection';
import { AddAthletePublicEnum } from 'libs/enums/athlete';
import { v4 as uuidv4 } from 'uuid';
import { useUploadDocument } from 'services/hooks/athlete/useUploadDocuments';
import { DocumentType } from 'libs/enums/athlete';
import moment from 'moment';

export const AddAthlete = () => {
    const deviceId = uuidv4();
    const { isPending: isDocsLoading } = useUploadDocument();

    const { trans } = useLocales();
    const dispatch = useDispatch();
    const {
        params: { id, extra },
    } = router.getState();

    const Schema = useAthleteSchema();

    const { control, getValues, handleSubmit, trigger } = useForm({
        mode: 'all',
        resolver: yupResolver(Schema as any),
    });

    const { mutate: checkLink, isPending: isCheckLoading } = useCheckPublicAthleteLinkExists({
        onError: () => {
            toast.error(trans('error.message'));
            router.navigate('signin', { replace: true });
        },
    });

    const {
        mutate: createAthlete,
        isPending,
        data,
    } = usePostAthletePublic({
        onSuccess: (data) => {
            if (
                ![AddAthletePublicEnum.CLUB_DOCUMENT, AddAthletePublicEnum.DOCUMENT].includes(extra)
            ) {
                dispatch(
                    setModalContent({
                        modalContent: {
                            type: 'success',
                            title: 'Success',
                            subtitle: 'Athlete data has been updated',
                            redirect: {
                                path: 'home',
                                condition: true,
                            },
                        },
                    }),
                );
                router.navigate('signin', { replace: true });
            }
        },
        onError: (error) => {
            dispatch(
                setModalContent({
                    modalContent: {
                        type: 'warning',
                        title: 'Warning',
                        subtitle: error.message,
                        redirect: {
                            path: 'home',
                            condition: false,
                        },
                    },
                }),
            );
        },
    });

    const handleSave = async () => {
        const formData = selectOptionsToValues(getValues(), [
            'relationship',
            'nationality',
            'education',
            'gender',
            'allergies',
            'injury',
            'consideration',
            'sport',
            'branch',
            'status',
            'paymentMethod',
        ]);

        createAthlete({
            academyId: id,
            firstName: formData.firstName,
            lastName: formData.lastName,
            avatar: formData.avatar,
            contactNumber: formData.contactNumber,
            dateOfBirth: formData.dateOfBirth,
            joinDate: formData.joinDate,
            nin: formData.nin,
            ninExpirationDate: formData.ninExpirationDate,
            dateOfUpdating: formData.dateOfUpdating,
            allergies: formData.allergies,
            chronic: formData.chronic ? formData.chronic.map((item: any) => item.value) : [],
            injury: formData.injury,
            consideration: formData.consideration,
            relationship: formData.relationship,
            nationality: formData.nationality,
            education: formData.education,
            gender: formData.gender,
            periodOfSubscription: formData.periodOfSubscription,
            paymentMethod: formData.paymentMethod,
            cashValue: formData.cashValue,
            remainingValue: formData.remainingValue,
            deviceIdentifier: deviceId,
        });
    };

    const handleCancelAction = async () => {
        router.navigate('signin', { replace: true });
    };

    useEffect(() => {
        if (deviceId) checkLink({ academyId: id, deviceIdentifier: deviceId });
    }, [id, checkLink]);

    if (isCheckLoading || !deviceId) return <Loader />;

    const atheletId = (data as any)?.payload?.id;

    return (
        <Theme.Body>
            <Theme.TableTitle value={trans('addAthlete.title')} variant="h3" />

            <FormRow
                title={trans('form.editAthleteProfile.name')}
                content={
                    <Theme.NameInputsWrapper>
                        <InputController
                            type="text"
                            {...{
                                disabled: atheletId,
                                control,
                                name: 'firstName',
                                placeholder: trans('form.enterFirstName'),
                            }}
                        />
                        <InputController
                            type="text"
                            {...{
                                disabled: atheletId,
                                control,
                                name: 'lastName',
                                placeholder: trans('form.enterLastName'),
                            }}
                        />
                    </Theme.NameInputsWrapper>
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthleteProfile.athletePhoto')}
                subtitle={trans('form.sport.profile.image')}
                content={
                    <InputFileController
                        {...{
                            control,
                            trigger: trigger as (name?: any) => Promise<boolean>,
                            name: 'avatar',
                            contents: (
                                <Theme.UploadText>
                                    {trans('form.editAthleteProfile.uploadText3')}
                                </Theme.UploadText>
                            ),
                        }}
                    />
                }
            />
            <Divider />

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
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.birth')}
                content={
                    <InputDateController
                        {...{
                            control,
                            showMonthAsNumber: true,
                            name: 'dateOfBirth',
                            withPortal: false,
                        }}
                        maxDate={getDateYearsFromNow(5)}
                    />
                }
            />
            <Divider />

            {/* <FormRow
                title={trans('form.editAthletePersonalInfo.join')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'joinDate',
                            withPortal: false,
                        }}
                    />
                }
            /> */}
            <Divider />
            {!router.getState()?.path.includes('club') && (
                <>
                    <FormRow
                        title={trans('form.editAthletePersonalInfo.paymentMethod')}
                        content={
                            <MultiSelectController
                                {...{
                                    control,
                                    name: 'paymentMethod',
                                    options: arrayToSelectOptions({ array: PaymentMethod }),
                                    transSuffix: 'form.editAthletePersonalInfo.paymentMethod.',
                                    menuPlacement: 'bottom',
                                }}
                            />
                        }
                    />
                    <Divider />
                    <FormRow
                        title={trans('form.editAthletePersonalInfo.cashValue')}
                        content={
                            <InputController
                                {...{
                                    control,
                                    name: 'cashValue',
                                    type: 'number',
                                    min: 0,
                                }}
                            />
                        }
                    />
                    <Divider />
                    <FormRow
                        title={trans('form.editAthletePersonalInfo.remainingValue')}
                        content={
                            <InputController
                                {...{
                                    control,
                                    name: 'remainingValue',
                                    type: 'number',
                                    min: 0,
                                }}
                            />
                        }
                    />
                    <Divider />
                </>
            )}

            <FormRow
                title={trans('form.editAthletePersonalInfo.education')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'education',
                            options: arrayToSelectOptions({ array: Education }),
                            transSuffix: 'form.editAthletePersonalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.gender')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'gender',
                            options: arrayToSelectOptions({ array: Gender }),
                            transSuffix: 'global.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.nin')}
                content={
                    <InputController
                        {...{
                            control,
                            name: 'nin',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editAthletePersonalInfo.ninExpire')}
                content={
                    <InputDateController
                        {...{
                            showMonthAsNumber: true,
                            control,
                            name: 'ninExpirationDate',
                            withPortal: false,
                        }}
                        maxDate={moment().add(10, 'years').toDate()}
                        minDate={moment().toDate()}
                    />
                }
            />
            <Divider />

            {/* <FormRow
                title={trans('form.editMedicalInfo.updating')}
                content={
                    <InputDateController
                        {...{
                            control,
                            name: 'dateOfUpdating',
                            withPortal: false,
                        }}
                    />
                }
            />
            <Divider /> */}

            <FormRow
                title={trans('form.editMedicalInfo.allergies')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'allergies',
                            options: arrayToSelectOptions({ array: YesNo }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editMedicalInfo.chronicDisease')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'chronic',
                            autocomplete: 'chronic',
                            options: arrayToSelectOptions({
                                array: CHRONIC_DISEASES,
                            }),
                            isMulti: true,
                            isCreatable: true,
                            menuPlacement: 'bottom',
                            transSuffix: 'form.editMedicalInfo.CHRONIC_DISEASES.',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editMedicalInfo.injury')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'injury',
                            options: arrayToSelectOptions({ array: YesNo }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />
            <Divider />

            <FormRow
                title={trans('form.editMedicalInfo.consideration')}
                content={
                    <MultiSelectController
                        {...{
                            control,
                            name: 'consideration',
                            options: arrayToSelectOptions({ array: Consideration }),
                            transSuffix: 'form.editMedicalInfo.',
                            menuPlacement: 'bottom',
                        }}
                    />
                }
            />

            <Divider />
            {[AddAthletePublicEnum.CLUB_DOCUMENT, AddAthletePublicEnum.DOCUMENT].includes(
                extra,
            ) && (
                <FormRow
                    title={trans('documentType.nationalID')}
                    content={
                        <PersonalDocumentsSection
                            name="documentAttachments1"
                            control={control}
                            athleteId={atheletId}
                            type={DocumentType.NATIONAL_ID}
                        />
                    }
                />
            )}

            {[AddAthletePublicEnum.CLUB_DOCUMENT, AddAthletePublicEnum.DOCUMENT].includes(
                extra,
            ) && (
                <FormRow
                    title={trans('documentType.passportForeignNational')}
                    content={
                        <PersonalDocumentsSection
                            name="documentAttachments2"
                            control={control}
                            athleteId={atheletId}
                            type={DocumentType.PASSPORT}
                        />
                    }
                />
            )}

            {[AddAthletePublicEnum.CLUB_DOCUMENT, AddAthletePublicEnum.DOCUMENT].includes(
                extra,
            ) && (
                <FormRow
                    title={trans('documentType.guardianNationalID')}
                    content={
                        <PersonalDocumentsSection
                            name="documentAttachments3"
                            control={control}
                            athleteId={atheletId}
                            type={DocumentType.FATHER_NATIONAL_ID}
                        />
                    }
                />
            )}

            {[AddAthletePublicEnum.CLUB_DOCUMENT, AddAthletePublicEnum.DOCUMENT].includes(
                extra,
            ) && (
                <FormRow
                    title={trans('documentType.bankAccountInfo')}
                    content={
                        <PersonalDocumentsSection
                            name="documentAttachments4"
                            control={control}
                            athleteId={atheletId}
                            type={DocumentType.OTHER}
                        />
                    }
                />
            )}

            <FormRow
                content={
                    <ButtonsControls
                        handleSave={handleSubmit(handleSave)}
                        saveText={'form.save'}
                        customIsLoading={isPending || isDocsLoading}
                        cancelText={'form.cancel'}
                        handleCancel={handleCancelAction}
                    />
                }
            />

            <Divider />
        </Theme.Body>
    );
};
