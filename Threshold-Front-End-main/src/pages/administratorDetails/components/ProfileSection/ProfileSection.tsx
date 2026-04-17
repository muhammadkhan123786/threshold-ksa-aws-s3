import React, { useEffect, useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { stringToDateString } from 'libs/helpers';
import moment from 'moment';
import { EditBankData } from 'components/administratorDetailsModals/bankDataModal';
import { EditContact } from 'components/administratorDetailsModals/contactModal';
import { EditPersonalInformation } from 'components/administratorDetailsModals/personalInformationModal';
import { EditMedicalInformation } from 'components/coachModals/medicalInformationModal';
import { MedicalFilesModal } from 'components/coachModals/medicalInfoForm';
import { AddNewMedicalFile } from 'components/coachModals/addNewMedicalFile';
import { TemplatesTableMedicalHistory } from 'components/templatesTableMedicalHistory';
import { AddNewMedicalRecord } from 'components/coachModals/addNewMedicalRecordModal';
import DocumentCard from 'components/documentsCard/DocumentCard';
import { AddNewDocumentFile } from 'components/administratorDetailsModals/addNewDocumentFile';
import { router } from 'routers';
import { EmptyDOCS } from 'components';
import { useBreadcrumbs } from 'hooks/breadcrumbs';
import { EditAdminStratorContract } from 'components/administratorDetailsModals/contractModal';
import { useSelector } from 'react-redux';
import { useClubList } from 'services/hooks/clubProfile/useClubList';
import { selectAcademy } from 'store';

interface ProfileSectionProps {
    adminDetails: any;
    personalInfo: any;
    contactInfo: any;
    documents: any;
    teamsData: any;
    contractDate: any;
}

const ProfileSection: React.FC<ProfileSectionProps> = ({
    adminDetails,
    personalInfo,
    contactInfo,
    documents,
    teamsData,
    contractDate,
}) => {
    const { isRTL, trans } = useLocales();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(50);
    const [isModalOpenContract, setIsModalOpenContract] = useState(false);
    const {
        params: { sportId, id },
    } = router.getState();
    const { academy } = useSelector(selectAcademy);
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
        medicalInformation: false,
        medicalHistory: false,
        medicalFiles: false,
        addNewMedicalFile: false,
        addNewDocumentFile: false,
    });

    // there is all functions to set opened modal
    const toggleModal = (modalName: string, isOpen: boolean) => {
        setModalState((prevState) => ({ ...prevState, [modalName]: isOpen }));
    };
    useEffect(() => {}, [modalState]);

    const breadcrumbs = filteredSport
        ? [
              { label: trans(`sport.${filteredSport.sport}`), path: 'home' },
              {
                  label: trans('breadcrumbs.administrator'),
                  path: 'administrator',
                  params: { sportId },
              },
              {
                  label: id,
                  path: `/administrator-details`,
                  params: { sportId, id },
              },
          ]
        : [];
    useBreadcrumbs(breadcrumbs, trans, sportId);
    const handleOpenModalContract = () => {
        setIsModalOpenContract(true);
    };
    const handleCloseModalContract = () => {
        setIsModalOpenContract(false);
    };
    return (
        <Theme.InfoWrap>
            <EditBankData
                isOpen={modalState.bankData}
                onClose={() => toggleModal('bankData', false)}
                adminDetails
            />
            <EditContact
                isOpen={modalState.contact}
                onClose={() => toggleModal('contact', false)}
                contactInfo
            />
            <EditPersonalInformation
                isOpen={modalState.personalInformation}
                onClose={() => toggleModal('personalInformation', false)}
                teamsData={teamsData}
            />
            <EditMedicalInformation
                isOpen={modalState.medicalInformation}
                onClose={() => toggleModal('medicalInformation', false)}
            />
            <MedicalFilesModal
                isOpen={modalState.medicalFiles}
                onClose={() => toggleModal('medicalFiles', false)}
            />
            <AddNewMedicalFile
                isOpen={modalState.addNewMedicalFile}
                onClose={() => toggleModal('addNewMedicalFile', false)}
            />
            <AddNewMedicalRecord
                isOpen={modalState.medicalHistory}
                onClose={() => toggleModal('medicalHistory', false)}
            />
            <AddNewDocumentFile
                isOpen={modalState.addNewDocumentFile}
                onClose={() => toggleModal('addNewDocumentFile', false)}
            />
            <EditAdminStratorContract
                isOpen={isModalOpenContract}
                onClose={() => handleCloseModalContract()}
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

                        {/* <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.joinDate')}:</Theme.Label>
                            {personalInfo?.joinDate ? (
                                stringToDateString(personalInfo.joinDate)
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow> */}

                        {/* <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.expirationDate')}:</Theme.Label>
                            {personalInfo?.expiration ? (
                                stringToDateString(personalInfo.expiration)
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow> */}

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
                            <Theme.Label>{trans('coach.profile.educationLevel')}:</Theme.Label>
                            {personalInfo?.levelEducation &&
                            personalInfo.levelEducation !== 'undefined' ? (
                                trans(`form.editAthletePersonalInfo.${personalInfo.levelEducation}`)
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
                            <Theme.Label>{trans('coach.profile.playingFor')} :</Theme.Label>
                            {personalInfo?.playingFor ? (
                                trans(`${personalInfo?.playingFor.name}`)
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

                        {/* <Theme.InfoRow>
                            <Theme.Label>{trans('athlete.body.weight')} :</Theme.Label>
                            {personalInfo?.weight ? (
                                personalInfo?.weight
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow> */}

                        {/* <Theme.InfoRow>
                            <Theme.Label>{trans('athlete.body.height')} :</Theme.Label>
                            {personalInfo?.height ? (
                                personalInfo?.height
                            ) : (
                                <img
                                    src="/assets/icons/NullIcon.svg"
                                    alt="Null Icon"
                                    width="16"
                                    height="16"
                                />
                            )}
                        </Theme.InfoRow> */}
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
                                    {contactInfo?.nationalIdExpiration ? (
                                        contactInfo?.nationalIdExpiration
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
                                    {adminDetails?.bankDetails?.iban ? (
                                        adminDetails.bankDetails.iban
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
                                    {adminDetails?.bankDetails?.bank ? (
                                        trans(`bank.${adminDetails.bankDetails.bank}`)
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
                                    {adminDetails?.bankDetails?.accountHolder ? (
                                        adminDetails.bankDetails.accountHolder
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
                    <button onClick={handleOpenModalContract}>
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
                        <Theme.Label>{trans('athlete.personal.expirationDate')}:</Theme.Label>
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
            <Theme.WrapRecords>
                {/* *-*-*-*-*-*-*-*-*-*-START medical information*-*-*-*-*-*-*-*-*-*-*-*-* */}
                {/* <Theme.DivWraper>
                    <Theme.LabelAndIconWaper>
                        {trans('coach.profile.Edit.medicalInformation')}
                        <button onClick={() => toggleModal('medicalInformation', true)}>
                            <img src="/assets/icons/edit.svg" alt="edit" height={24} width={24} />
                        </button>
                    </Theme.LabelAndIconWaper>
                    <Theme.StatusContainer3>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.Edit.lastUpdatedDate')}</Theme.Label>
                            {trans(`${fakeData?.athlete?.athleteMedicalInfo?.lastUpdatedDate}`)}
                        </Theme.InfoRow>
                        <Theme.InfoRow>
                            <Theme.Label>{trans('coach.profile.Edit.allergies')}</Theme.Label>
                            {trans(`${fakeData?.athlete?.athleteMedicalInfo?.allergies}`)}
                        </Theme.InfoRow>

                        <Theme.InfoRow>
                            <Theme.Label>{trans('athlete.medical.chronic')}</Theme.Label>
                            {fakeData?.athlete?.athleteMedicalInfo?.chronicIllnesses
                                ? trans(
                                      `athlete.truthyValue.${
                                          fakeData?.athlete?.athleteMedicalInfo?.chronicIllnesses
                                              ?.length > 0
                                              ? 'yes'
                                              : 'no'
                                      }`,
                                  )
                                : '-'}
                        </Theme.InfoRow>
                        <Theme.InfoRow>
                            <Theme.Label>
                                {trans('coach.profile.Edit.healthConsiderations')}
                            </Theme.Label>{' '}
                            {fakeData?.athlete?.athleteMedicalInfo?.chronicIllnesses
                                ? fakeData?.athlete?.athleteMedicalInfo?.chronicIllnesses
                                : '-'}
                        </Theme.InfoRow>
                    </Theme.StatusContainer3>
                </Theme.DivWraper> */}
                {/* *-*-*-*-*-*-*-*-*-*-END medical information*-*-*-*-*-*-*-*-*-*-*-*-* */}

                {/* *-*-*-*-*-*-*-*-*-*-START medical Files*-*-*-*-*-*-*-*-*-*-*-*-* */}
                {/* <Theme.DivWraper>
                    <Theme.LabelAndIconWaper>
                        {trans('coach.profile.Edit.medicalFiles')}
                        <Theme.FileIconWrapper>
                            <button onClick={() => toggleModal('addNewMedicalFile', true)}>
                                <img
                                    src="/assets/icons/add-icon-black.svg"
                                    alt="edit"
                                    height={24}
                                    width={24}
                                />
                            </button>
                            <button onClick={() => toggleModal('medicalFiles', true)}>
                                <img
                                    src="/assets/icons/edit.svg"
                                    alt="edit"
                                    height={24}
                                    width={24}
                                />
                            </button>
                        </Theme.FileIconWrapper>
                    </Theme.LabelAndIconWaper>
                    <Theme.StatusContainer3>
                        <Theme.InfoRow>
                            <Theme.Label>
                                {fakeData?.athlete?.uploadedFileDate
                                    ? new Date(
                                          fakeData.athlete.uploadedFileDate,
                                      ).toLocaleDateString()
                                    : 'No Date Available'}
                            </Theme.Label>

                            {fakeData?.athlete?.uploadedFile && (
                                <Theme.FileContainer>
                                    <Theme.FileButton
                                        onClick={() =>
                                            window.open(fakeData.athlete.uploadedFile, '_blank')
                                        }
                                    >
                                        <img
                                            src="/assets/icons/file-icon.svg"
                                            alt="edit"
                                            height={18}
                                            width={18}
                                        />
                                        <Theme.FileName>
                                            {fakeData.athlete.uploadedFile.split('/').pop() ||
                                                'File'}
                                        </Theme.FileName>
                                    </Theme.FileButton>
                                </Theme.FileContainer>
                            )}
                        </Theme.InfoRow>
                    </Theme.StatusContainer3>
                </Theme.DivWraper> */}
                {/* *-*-*-*-*-*-*-*-*-*-END medical Files*-*-*-*-*-*-*-*-*-*-*-*-* */}
            </Theme.WrapRecords>

            {/* <Theme.LabelAndIconWaper>
                {trans('coach.profile.add.medicalHistory')}
                <button onClick={() => toggleModal('medicalHistory', true)}>
                    <img src="/assets/icons/add-icon-black.svg" alt="edit" height={24} width={24} />
                </button>
            </Theme.LabelAndIconWaper>
            <TemplatesTableMedicalHistory columns={columns || []} data={medicalRecords?.records} /> */}

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

export default ProfileSection;
