import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { controlsSlice } from 'store';
import { Table } from 'components/table';
import { Athlete } from 'libs/types';
import { stringToDateString, valueToSelectOption } from 'libs/helpers';
import { Consideration, UserRole, YesNo } from 'libs/enums';
import { WithRole } from 'hooks/roles';

interface Props {
    athlete: Athlete;
}

export const MedicalInfoTable = ({ athlete }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('athlete.medicalInformation')} />
                <WithRole blockRoles={[UserRole.COACH]}>
                    <Theme.Button
                        onClick={() => {
                            dispatch(
                                controlsSlice.actions.setModalContent({
                                    modalContent: {
                                        type: 'editMedicalInfo',
                                        title: trans('form.editMedicalInfo.title'),
                                        subtitle: trans('form.editMedicalInfo.subtitle'),
                                        defaults: {
                                            dateOfUpdating: athlete.dateOfUpdating,
                                            allergies: valueToSelectOption(
                                                athlete.allergies,
                                                YesNo,
                                                trans,
                                                'form.editMedicalInfo.',
                                            ),
                                            chronic: valueToSelectOption(
                                                '',
                                                null,
                                                trans,
                                                'form.editMedicalInfo.',
                                                athlete.chronic,
                                            ),
                                            injury: valueToSelectOption(
                                                athlete.injury,
                                                YesNo,
                                                trans,
                                                'form.editMedicalInfo.',
                                            ),
                                            consideration: valueToSelectOption(
                                                athlete.consideration,
                                                Consideration,
                                                trans,
                                                'form.editMedicalInfo.',
                                            ),
                                        },
                                    },
                                }),
                            );
                        }}
                        $isTable={true}
                    >
                        {trans('athlete.update')}
                    </Theme.Button>
                </WithRole>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={5}
                        headerRow={[
                            <>{trans('athlete.medical.updating')}</>,
                            <>{trans('athlete.medical.allergies')}</>,
                            <>{trans('athlete.medical.chronic')}</>,
                            <>{trans('athlete.medical.injury')}</>,
                            <>{trans('athlete.medical.consideration')}</>,
                        ]}
                        rowsComponents={[
                            [
                                <>{stringToDateString(athlete?.dateOfUpdating)}</>,
                                <>{trans(`athlete.truthyValue.${athlete?.allergies}`)}</>,
                                <>
                                    {trans(
                                        `athlete.truthyValue.${
                                            athlete?.chronic?.length > 0 ? 'yes' : 'no'
                                        }`,
                                    )}
                                </>,
                                <>
                                    {trans(`athlete.truthyValue.${athlete?.injury ? 'yes' : 'no'}`)}
                                </>,
                                <>{trans(`form.editMedicalInfo.${athlete?.consideration}`)}</>,
                            ],
                        ]}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
