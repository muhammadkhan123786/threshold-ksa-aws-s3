import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { stringToDateString } from 'libs/helpers';
import moment from 'moment';
import DocumentCard from 'components/documentsCard/DocumentCard';
import { router } from 'routers';
import { EmptyDOCS } from 'components';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { useSelector } from 'react-redux';
import { selectAcademy } from 'store';
import {
    EditContract,
    EditContact,
    EditBankData,
    AddNewDocumentFile,
    EditPersonalInformation,
} from 'components/managerModals';

interface ProfileSectionProps {
    personalInfo?: any;
    contactInfo?: any;
    documents?: any;
    contractDate?: any;
    bankData?: any;
    managerDetails?: any;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
    personalInfo,
    contactInfo,
    documents,
    contractDate,
    bankData,
    managerDetails,
}) => {
    const { isRTL, trans } = useLocales();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const { academy } = useSelector(selectAcademy);
    const {
        params: { sportId, id },
    } = router.getState();
    const { data: clubData } = useClubList(academy?.id);
    const filteredSport: any = clubData?.payload?.find((club) => club?.id === sportId);
    const [columns, setColumns] = useState<any>([
        {
            key: 'date',
            label: trans('player.table.date'),
            width: '15%',
            sortable: false,
        },
        {
            key: 'type',
            label: trans('player.table.type'),
            width: '15%',
            sortable: true,
        },
        {
            key: 'description',
            label: trans('player.table.description'),
            width: '15%',
            sortable: true,
        },
        {
            key: 'edit',
            label: '',
            width: '15%',
            sortable: true,
        },
    ]);

    const [modalState, setModalState] = useState({
        bankData: false,
        contact: false,
        personalInformation: false,
        addNewDocumentFile: false,
        contract: false,
    });

    // there is all functions to set opened modal
    const toggleModal = (modalName: string, isOpen: boolean) => {
        setModalState((prevState) => ({ ...prevState, [modalName]: isOpen }));
    };
    useEffect(() => {}, [modalState]);

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              { label: trans('breadcrumbs.coaches'), path: 'coaches', params: { sportId } },
              {
                  label: id,
                  path: `/coach-details`,
                  params: { sportId, id },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    return (
        <Theme.InfoWrap>
            <EditBankData
                isOpen={modalState.bankData}
                onClose={() => toggleModal('bankData', false)}
            />
            <EditContact
                isOpen={modalState.contact}
                onClose={() => toggleModal('contact', false)}
                contactInfo
            />
            <EditPersonalInformation
                isOpen={modalState.personalInformation}
                onClose={() => toggleModal('personalInformation', false)}
                managerDetails={managerDetails}
            />
            <AddNewDocumentFile
                isOpen={modalState.addNewDocumentFile}
                onClose={() => toggleModal('addNewDocumentFile', false)}
            />
            <EditContract
                isOpen={modalState.contract}
                onClose={() => toggleModal('contract', false)}
            />
            <Theme.WrapRecords>
                {/* *-*-*-*-*-*-*-*-*-*- START personal information*-*-*-*-*-*-*-*-*-*-*-*-* */}

                <Theme.DivWrapper>
                    <Theme.LabelAndIconWrapper>
                        {trans('profile.personalInformation')}
                        <button onClick={() => toggleModal('personalInformation', true)}>
                            <img src="/assets/icons/edit.svg" alt="edit" height={24} width={24} />
                        </button>
                    </Theme.LabelAndIconWrapper>
                    <Theme.StatusContainer3>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.name')}:</Theme.Label>
                            {personalInfo?.firstName && personalInfo?.lastName ? (
                                `${personalInfo.firstName} ${personalInfo.lastName}`
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>

                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.experience')}:</Theme.Label>
                            {personalInfo?.experience ? (
                                personalInfo?.experience
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>

                        <Theme.InfoRow>
                            <Theme.Label>
                                {trans('manager.profile.details.manageType')}:
                            </Theme.Label>
                            {personalInfo?.user?.role ? (
                                trans(`form.manager.managementType.${personalInfo?.user?.role}`)
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.birth')}:</Theme.Label>
                            {personalInfo?.birthday ? (
                                stringToDateString(personalInfo.birthday)
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.gender')}:</Theme.Label>
                            {personalInfo?.gender ? (
                                trans(`gender.${personalInfo.gender}`)
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.country')} :</Theme.Label>
                            {personalInfo?.country ? (
                                trans(`form.editAthleteProfile.${personalInfo.country}`)
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.educationLevel')}:</Theme.Label>
                            {personalInfo?.educationalLevel &&
                            personalInfo?.educationalLevel !== 'undefined' ? (
                                trans(
                                    `form.editAthletePersonalInfo.${personalInfo?.educationalLevel}`,
                                )
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>

                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.school')}:</Theme.Label>
                            {personalInfo?.schoolName ? (
                                personalInfo?.schoolName
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow>
                    </Theme.StatusContainer3>
                </Theme.DivWrapper>

                {/* *-*-*-*-*-*-*-*-*-*-END personal information*-*-*-*-*-*-*-*-*-*-*-*-* */}

                <Theme.ContainersWrap>
                    {/* *-*-*-*-*-*-*-*-*-*-START contact*-*-*-*-*-*-*-*-*-*-*-*-* */}
                    <Theme.DivWraper>
                        <Theme.LabelAndIconWaper>
                            {trans('form.editAthleteProfile.contact')}
                            <button onClick={() => toggleModal('contact', true)}>
                                <img
                                    src="/assets/icons/edit.svg"
                                    alt="edit"
                                    height={24}
                                    width={24}
                                />
                            </button>
                        </Theme.LabelAndIconWaper>
                        <Theme.StatusContainer3>
                            <>
                                <Theme.InfoRow>
                                    <Theme.Label>
                                        {trans('form.editAthleteProfile.phoneNumber')}:
                                    </Theme.Label>
                                    {contactInfo?.phone ? (
                                        contactInfo?.phone
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>

                                <Theme.InfoRow>
                                    <Theme.Label>
                                        {trans('coach.profile.UrgentPhoneNumber')}:
                                    </Theme.Label>
                                    {contactInfo?.emergencyPhone ? (
                                        <span>
                                            (
                                            {trans(
                                                `form.editAthleteProfile.${contactInfo?.relationship}`,
                                            )}
                                            ) {contactInfo?.emergencyPhone}
                                        </span>
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>

                                <Theme.InfoRow>
                                    <Theme.Label>{trans('coach.profile.nationalID')}:</Theme.Label>
                                    {contactInfo?.nationalId ? (
                                        contactInfo?.nationalId
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>

                                <Theme.InfoRow>
                                    <Theme.Label>
                                        {trans('coach.profile.nationalIDExpiration')}:
                                    </Theme.Label>
                                    {contactInfo?.nationalIdExpirationDate ? (
                                        contactInfo?.nationalIdExpirationDate
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>
                            </>
                        </Theme.StatusContainer3>
                    </Theme.DivWraper>
                    {/* *-*-*-*-*-*-*-*-*-*-END contact*-*-*-*-*-*-*-*-*-*-*-*-* */}

                    {/* *-*-*-*-*-*-*-*-*-*-START BANK DATA *-*-*-*-*-*-*-*-*-*-*-*-* */}
                    <Theme.DivWraper>
                        <Theme.LabelAndIconWaper>
                            {trans('athlete.bankData')}
                            <button onClick={() => toggleModal('bankData', true)}>
                                <img
                                    src="/assets/icons/edit.svg"
                                    alt="edit"
                                    height={24}
                                    width={24}
                                />
                            </button>
                        </Theme.LabelAndIconWaper>
                        <Theme.StatusContainer3>
                            <>
                                <Theme.InfoRow>
                                    <Theme.Label>{trans('athlete.ibanNumber')}:</Theme.Label>
                                    {bankData?.iban ? (
                                        bankData?.iban
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>

                                <Theme.InfoRow>
                                    <Theme.Label>{trans('athlete.bankName')}:</Theme.Label>
                                    {bankData?.bank ? (
                                        trans(`bank.${bankData?.bank}`)
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>

                                <Theme.InfoRow>
                                    <Theme.Label>{trans('athlete.accountOwner')}:</Theme.Label>
                                    {bankData?.accountHolder ? (
                                        bankData?.accountHolder
                                    ) : (
                                        <img
                                            src="/assets/icons/NullIcon.svg"
                                            alt="Null Icon"
                                            width="16"
                                            height="16"
                                        />
                                    )}
                                </Theme.InfoRow>
                            </>
                        </Theme.StatusContainer3>
                    </Theme.DivWraper>
                    {/* *-*-*-*-*-*-*-*-*-*-END BANK DATA *-*-*-*-*-*-*-*-*-*-*-*-* */}
                </Theme.ContainersWrap>
            </Theme.WrapRecords>
            {/* *-*-*-*-*-*-*-*-*-*- START Contracting*-*-*-*-*-*-*-*-*-*-*-*-* */}
            <Theme.DivWraper>
                <Theme.LabelAndIconWaper>
                    {trans('form.editAthleteProfile.contracting')}
                    <button onClick={() => toggleModal('contract', true)}>
                        <img src="/assets/icons/edit.svg" alt="edit" height={24} width={24} />
                    </button>
                </Theme.LabelAndIconWaper>
                <Theme.StatusContainer3>
                    <Theme.InfoRow>
                        <Theme.Label>{trans('form.editAthleteProfile.joinDate')}:</Theme.Label>
                        {contractDate?.joinDate ? (
                            isRTL ? (
                                moment(contractDate?.joinDate).format('DD-MM-YYYY')
                            ) : (
                                contractDate?.joinDate
                            )
                        ) : (
                            <img
                                src="/assets/icons/NullIcon.svg"
                                alt="Null Icon"
                                width="16"
                                height="16"
                            />
                        )}
                    </Theme.InfoRow>
                    {/* Emergency Contact Phone Number */}
                    <Theme.InfoRow>
                        <Theme.Label>
                            {trans('form.editAthleteProfile.contractDuration')}:
                        </Theme.Label>
                        {contractDate?.contractDuration ? (
                            trans(
                                `form.subscriptionManagement.periodSubscription.${contractDate.contractDuration}`,
                            )
                        ) : (
                            <img
                                src="/assets/icons/NullIcon.svg"
                                alt="Null Icon"
                                width="16"
                                height="16"
                            />
                        )}
                    </Theme.InfoRow>

                    {/* National Identification Number (NIN) */}
                    <Theme.InfoRow>
                        <Theme.Label>
                            {trans('form.editAthleteProfile.contractEndDate')}:
                        </Theme.Label>
                        {contractDate?.expirationDate ? (
                            isRTL ? (
                                moment(contractDate?.expirationDate).format('DD-MM-YYYY')
                            ) : (
                                contractDate?.expirationDate
                            )
                        ) : (
                            <img
                                src="/assets/icons/NullIcon.svg"
                                alt="Null Icon"
                                width="16"
                                height="16"
                            />
                        )}
                    </Theme.InfoRow>
                    <Theme.InfoRow>
                        <Theme.Label>{trans('athlete.personal.file')}:</Theme.Label>
                        <Theme.FileButton
                            onClick={() => window.open(contractDate?.contractUrl, '_blank')}
                        >
                            <img
                                src="/assets/icons/file-icon.svg"
                                alt="edit"
                                height={18}
                                width={18}
                            />
                        </Theme.FileButton>
                    </Theme.InfoRow>
                </Theme.StatusContainer3>
            </Theme.DivWraper>
            {/* *-*-*-*-*-*-*-*-*-*- end Contracting*-*-*-*-*-*-*-*-*-*-*-*-* */}

            {/* *-*-*-*-*-*-*-*-*-*-START Document Section*-*-*-*-*-*-*-*-*-*-*-*-* */}
            <Theme.DivWraper>
                <Theme.LabelAndIconWaper>
                    {trans('coach.profile.document')}
                    <button onClick={() => toggleModal('addNewDocumentFile', true)}>
                        <img
                            src="/assets/icons/add-icon-black.svg"
                            alt="edit"
                            height={24}
                            width={24}
                        />
                    </button>
                </Theme.LabelAndIconWaper>
                {documents ? (
                    <Theme.DocumentSectionWrapper>
                        {documents?.map((doc: any) => <DocumentCard key={doc.id} doc={doc} />)}
                    </Theme.DocumentSectionWrapper>
                ) : (
                    <Theme.EmptyDOCSWrapper>
                        <EmptyDOCS />
                    </Theme.EmptyDOCSWrapper>
                )}
            </Theme.DivWraper>
            {/* *-*-*-*-*-*-*-*-*-*-END Document Section*-*-*-*-*-*-*-*-*-*-*-*-* */}
        </Theme.InfoWrap>
    );
};
