import { StatusIndicator } from 'components/status-indicator';
import { Table } from 'components/table';
import { useLocales } from 'hooks/locales';
import { SessionRecord } from 'libs/types';
import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { getAvatarPlaceholder } from 'libs/constants';
import { useId } from 'react';
import { getScaleExertion } from 'libs/helpers';

interface Props {
    sessionRecords: SessionRecord[];
}

export const SessionRecordsTable = ({ sessionRecords }: Props) => {
    const { trans } = useLocales();
    const key = useId();

    return (
        <Theme.ScrollWrapper>
            <Theme.TableWrapper>
                <Table
                    columns={7}
                    headerRow={[
                        <></>,
                        <>{trans('session.name')}</>,
                        <>{trans('session.athleteStatus')}</>,
                        <>{trans('session.scale')}</>,
                        <>{trans('session.exertion')}</>,
                        <>{trans('session.comment')}</>,
                        <></>,
                    ]}
                    rowsComponents={(sessionRecords || []).map(
                        ({ id, comment, status, scale, athlete }, index) => [
                            <Theme.Avatar
                                key={`${key}${id}${athlete?.avatar}`}
                                src={athlete?.avatar || getAvatarPlaceholder(athlete?.gender)}
                                alt="avatar"
                            />,
                            <div key={`${key}${id}${athlete?.firstName}${athlete?.lastName}`}>{`${
                                athlete?.firstName || ''
                            } ${athlete?.lastName || ''}`}</div>,
                            <StatusIndicator key={`${key}${status}`} isActive={true} />,
                            <div key={`${key}${id}${scale}`}>{scale}</div>,
                            <div key={`${key}${id}${scale}`}>
                                {trans(`session.${getScaleExertion(String(scale))}`)}
                            </div>,
                            <div key={`${key}${id}${comment}`}>{comment}</div>,
                            <div key={`empty${key}${id}${comment}`}></div>,
                        ],
                    )}
                />
            </Theme.TableWrapper>
        </Theme.ScrollWrapper>
    );
};
