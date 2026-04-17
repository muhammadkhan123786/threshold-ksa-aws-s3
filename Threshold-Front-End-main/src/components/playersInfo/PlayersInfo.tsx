import React from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { calculateYearsDifference } from 'libs/helpers';
import { TemplatesTablePlayersDetails } from 'components/templatesTablePlayersDetails';

interface PlayersInfoProps {
    columns: Array<any>;
    data: any;
    tableData: Array<any>;
}

export const PlayersInfo: React.FC<PlayersInfoProps> = ({ columns, data, tableData }) => {
    const { trans } = useLocales();
    const PlayersStatusCards = () => {
        return (
            <Theme.BoxContainer>
                <Theme.BoxStatus>
                    <Theme.BoxWrapStatus>
                        <Theme.BoxLabelStatus>{trans('player.days.sessions')}</Theme.BoxLabelStatus>
                        <Theme.BoxIcon>
                            <img
                                alt="calunder"
                                height={24}
                                width={24}
                                src="/assets/icons/calunder-icon.svg"
                            />
                        </Theme.BoxIcon>
                    </Theme.BoxWrapStatus>
                    <Theme.ValueWrapStatus>
                        <Theme.SpanDataFirst>190</Theme.SpanDataFirst>
                        <Theme.SpanDataSecond>76%</Theme.SpanDataSecond>
                    </Theme.ValueWrapStatus>
                    <Theme.SpanFooterDataDiv>
                        <Theme.SpanFooterData>124 Presence</Theme.SpanFooterData>
                        <Theme.HrLine />
                        <Theme.SpanFooterData>50 Injury</Theme.SpanFooterData>
                        <Theme.HrLine />
                        <Theme.SpanFooterData>3 Other</Theme.SpanFooterData>
                        <Theme.HrLine />
                        <Theme.SpanFooterData>3 National Team</Theme.SpanFooterData>
                    </Theme.SpanFooterDataDiv>
                </Theme.BoxStatus>
                <Theme.BoxStatus>
                    <Theme.BoxWrapStatus>
                        <Theme.BoxLabelStatus>{trans('player.level')}</Theme.BoxLabelStatus>
                        <Theme.BoxIcon>
                            <img
                                alt="calunder"
                                height={24}
                                width={24}
                                src="/assets/icons/level-icon.svg"
                            />
                        </Theme.BoxIcon>
                    </Theme.BoxWrapStatus>
                    <Theme.ValueWrapStatus>
                        <Theme.SpanDataFirst>Intermediate</Theme.SpanDataFirst>
                        <Theme.SpanDataSecond>Striker</Theme.SpanDataSecond>
                    </Theme.ValueWrapStatus>
                    <Theme.SpanFooterDataDiv>
                        <Theme.SpanFooterData>
                            {trans('players.status.category')}: {data?.gender},
                            {calculateYearsDifference(
                                new Date(),
                                new Date(data?.dateOfBirth || ''),
                            )}
                        </Theme.SpanFooterData>
                        <Theme.SpanFooterData>
                            {trans('players.status.since')} :
                            {calculateYearsDifference(new Date(), new Date(data?.joinDate || ''))}
                        </Theme.SpanFooterData>
                    </Theme.SpanFooterDataDiv>
                </Theme.BoxStatus>
                <Theme.BoxStatus>
                    <Theme.BoxWrapStatus>
                        <Theme.BoxLabelStatus>
                            {trans('player.perceivedExertion')}
                        </Theme.BoxLabelStatus>
                        <Theme.BoxIcon>
                            <img
                                alt="calunder"
                                height={24}
                                width={24}
                                src="/assets/icons/avg-icon.svg"
                            />
                        </Theme.BoxIcon>
                    </Theme.BoxWrapStatus>
                    <Theme.ValueWrapStatus>
                        <Theme.SpanDataFirst>Very Hard</Theme.SpanDataFirst>
                        <Theme.SpanDataSecond>9/10</Theme.SpanDataSecond>
                    </Theme.ValueWrapStatus>
                    <Theme.SpanFooterDataDiv>
                        <Theme.SpanFooterData>
                            {trans('players.status.coach')}: Hard 7/10
                        </Theme.SpanFooterData>
                        <Theme.SpanFooterData>
                            {trans('players.status.total')}: 124 sessions
                        </Theme.SpanFooterData>
                    </Theme.SpanFooterDataDiv>
                </Theme.BoxStatus>
            </Theme.BoxContainer>
        );
    };
    return (
        <Theme.InfoWrap>
            <PlayersStatusCards />
            <Theme.TableHeaderTitle>{trans('tableTitle.sessions.attended')}</Theme.TableHeaderTitle>
            <TemplatesTablePlayersDetails columns={columns || []} data={tableData || []} />
        </Theme.InfoWrap>
    );
};

export default PlayersInfo;
