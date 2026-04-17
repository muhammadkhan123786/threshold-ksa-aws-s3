import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Table } from 'components/table';
import { Team } from 'libs/types';
import { stringToDateString, valueToSelectOption } from 'libs/helpers';
import { setModalContent } from 'store/controlsSlice';
import { SportProfileType, UserRole } from 'libs/enums';
import { WithRole } from 'hooks/roles';

interface Props {
    team: Team;
}

export const TeamInfoTable = ({ team }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const handleEditInfo = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editTeamInfo',
                    title: trans('form.editTeamInfo.title'),
                    subtitle: trans('form.editTeamInfo.subtitle'),
                    defaults: {
                        sport: valueToSelectOption(team?.sport, SportProfileType, trans, 'sport.'),
                        name: team?.name,
                        branch: {
                            label: team?.branch,
                            value: team?.branch,
                        },
                        creationDate: team?.creationDate,
                        logo: team?.logo,
                        coach: {
                            label: `${team?.coach?.firstName} ${team?.coach?.lastName}`,
                            value: team?.coach?.id,
                        },
                        athletes:
                            !team?.athletes || team?.athletes?.length === 0
                                ? []
                                : team.athletes.map((athlete) => ({
                                      label: `${athlete.firstName} ${athlete.lastName}`,
                                      value: athlete.id,
                                  })),
                    },
                },
            }),
        );
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <WithRole blockRoles={[UserRole.COACH]}>
                    <Theme.Button onClick={handleEditInfo} $isTable={true}>
                        {trans('team.update')}
                    </Theme.Button>
                </WithRole>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={5}
                        headerRow={[
                            <>{trans('team.sport')}</>,
                            <>{trans('team.coach')}</>,
                            <>{trans('team.athletes')}</>,
                            <>{trans('team.branch')}</>,
                            <>{trans('team.creationDate')}</>,
                        ]}
                        rowsComponents={[
                            [
                                <>{trans(`sport.${team?.sport}`, team?.sport)}</>,
                                <>{`${team?.coach?.firstName} ${team?.coach?.lastName}`}</>,
                                <>{team?.athletes?.length}</>,
                                <>{team?.branch}</>,
                                <>{stringToDateString(team?.creationDate)}</>,
                            ],
                        ]}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
