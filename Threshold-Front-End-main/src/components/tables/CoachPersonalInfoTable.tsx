import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Table } from 'components/table';
import { Coach } from 'libs/types';
import { stringToDateString, valueToSelectOption } from 'libs/helpers';
import { setModalContent } from 'store/controlsSlice';
import { Gender, SportProfileType } from 'libs/enums';

interface Props {
    coach: Coach;
}

export const CoachPersonalInfoTable = ({ coach }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const handleEditInfo = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editCoachPersonalInfo',
                    title: trans('form.editCoachPersonalInfo.title'),
                    subtitle: trans('form.editCoachPersonalInfo.subtitle'),
                    defaults: {
                        joinDate: coach?.joinDate,
                        sport: valueToSelectOption(coach?.sport, SportProfileType, trans, 'sport.'),
                        gender: valueToSelectOption(coach?.gender, Gender, trans, 'global.'),
                        phone: coach?.phone,
                        birthday: coach?.birthday,
                        experience: coach?.experience,
                        // email: coach?.user?.email,
                    },
                },
            }),
        );
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('coach.personalInformation')} />

                <Theme.Button onClick={handleEditInfo} $isTable={true}>
                    {trans('coach.personal.update')}
                </Theme.Button>
            </Theme.ButtonWrapper>

            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={7}
                        headerRow={[
                            <>{trans('coach.personal.joinDate')}</>,
                            <>{trans('coach.personal.sport')}</>,
                            <>{trans('coach.personal.experience')}</>,
                            <>{trans('coach.personal.birthday')}</>,
                            <>{trans('coach.personal.gender')}</>,
                            <>{trans('coach.personal.phone')}</>,
                            <>{trans('coach.personal.mail')}</>,
                        ]}
                        rowsComponents={[
                            [
                                <>{stringToDateString(coach?.joinDate)}</>,
                                <>{trans(`sport.${coach?.sport}`, coach?.sport)}</>,
                                <>{`${coach?.experience} ${
                                    coach?.experience > 1
                                        ? trans('coach.personal.years')
                                        : trans('coach.personal.year')
                                }`}</>,
                                <>{stringToDateString(coach?.birthday)}</>,
                                <>{trans(`gender.${coach?.gender}`, coach?.gender)}</>,
                                <>{coach?.phone}</>,
                                <>{coach?.user?.email}</>,
                            ],
                        ]}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
