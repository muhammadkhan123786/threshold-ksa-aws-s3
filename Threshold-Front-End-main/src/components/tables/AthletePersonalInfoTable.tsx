import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Table } from 'components/table';
import { Athlete } from 'libs/types';
import { calculateYearsDifference, stringToDateString, valueToSelectOption } from 'libs/helpers';
import { Education, Gender, SubscriptionPeriod, UserRole, PaymentMethod } from 'libs/enums';
import { setModalContent } from 'store/controlsSlice';
import { WithRole } from 'hooks/roles';

interface Props {
    athlete: Athlete;
}

export const AthletePersonalInfoTable = ({ athlete }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const handleUpdate = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editAthletePersonalInfo',
                    title: trans('form.editAthletePersonalInfo.title'),
                    subtitle: trans('form.editAthletePersonalInfo.subtitle'),
                    defaults: {
                        dateOfBirth: athlete.dateOfBirth,
                        joinDate: athlete.joinDate,
                        nin: athlete.nin,
                        remainingValue: athlete.subscription?.remainingValue,
                        cashValue: athlete.subscription?.cashValue,

                        periodOfSubscription: valueToSelectOption(
                            athlete.subscription?.period,
                            SubscriptionPeriod,
                            trans,
                            'form.subscriptionManagement.periodSubscription.',
                        ),
                        paymentMethod: valueToSelectOption(
                            athlete.subscription?.paymentMethod,
                            PaymentMethod,
                            trans,
                            'form.editAthletePersonalInfo.paymentMethod.',
                        ),
                        education: valueToSelectOption(
                            athlete.education,
                            Education,
                            trans,
                            'form.editAthletePersonalInfo.',
                        ),
                        gender: valueToSelectOption(
                            athlete.gender,
                            Gender,
                            trans,
                            'form.editAthletePersonalInfo.',
                        ),
                        nationality: athlete.nationality,
                    },
                },
            }),
        );
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('athlete.personalInformation')} />

                <WithRole blockRoles={[UserRole.COACH]}>
                    <Theme.Button onClick={handleUpdate} $isTable={true}>
                        {trans('athlete.update')}
                    </Theme.Button>
                </WithRole>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={6}
                        headerRow={[
                            <>{trans('athlete.personal.date')}</>,
                            <>{trans('athlete.personal.education')}</>,
                            <>{trans('athlete.personal.gender')}</>,
                            <>{trans('athlete.personal.age')}</>,
                            <>{trans('athlete.personal.join')}</>,
                            <>{trans('athlete.personal.nin')}</>,
                        ]}
                        rowsComponents={[
                            [
                                <>{stringToDateString(athlete?.dateOfBirth)}</>,
                                <>{trans(`form.editAthletePersonalInfo.${athlete?.education}`)}</>,
                                <>{trans(`gender.${athlete?.gender}`, athlete?.gender)}</>,
                                <>
                                    {calculateYearsDifference(
                                        new Date(),
                                        new Date(athlete?.dateOfBirth || ''),
                                    )}
                                </>,
                                <>{stringToDateString(athlete?.joinDate)}</>,
                                <>{athlete?.nin}</>,
                            ],
                        ]}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
