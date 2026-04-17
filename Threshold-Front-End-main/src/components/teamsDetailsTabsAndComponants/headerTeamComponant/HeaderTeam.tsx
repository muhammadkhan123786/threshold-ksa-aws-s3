import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { calculateYearsDifference } from 'libs/helpers';
import { TeamsModal } from 'components/teamsModal';
interface DetailsData {
    teamDetails: any;
}
export const HeaderTeam: React.FC<DetailsData> = ({ teamDetails }) => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const formatDate = (isoString: string) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };
    return (
        <Theme.Body>
            <TeamsModal
                teamDetails={teamDetails}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <Theme.HeaderTeamWrapper>
                <Theme.HeaderClubWrapper>
                    <div
                        style={{
                            margin: '0px 50px',
                        }}
                    >
                        <Theme.CenteredColumn>
                            {teamDetails?.avatarUrl ? (
                                <img
                                    style={{
                                        borderRadius: '8px',
                                    }}
                                    src={teamDetails?.avatarUrl}
                                    height={160}
                                    width={160}
                                    alt="logo"
                                />
                            ) : (
                                <img
                                    style={{
                                        borderRadius: '8px',
                                    }}
                                    src="/assets/icons/helal-Club.svg"
                                    height={160}
                                    width={160}
                                    alt="logo"
                                />
                            )}
                        </Theme.CenteredColumn>
                        <Theme.CreatedDate>
                            {trans('header.teamDetails.created')}:
                            {formatDate(teamDetails?.createdAt)}
                        </Theme.CreatedDate>
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                        }}
                    >
                        <div>
                            <Theme.TeamName>{teamDetails?.name}</Theme.TeamName>
                            <Theme.TeamDetails>
                                <span>{trans(`category.${teamDetails?.gender}`)}</span>,
                                <span>{trans(`category.${teamDetails?.category}`)}</span>
                            </Theme.TeamDetails>
                        </div>
                        <Theme.DetailRow>
                            <Theme.DetailLabel>
                                <Theme.Icon src="/assets/icons/players-icon.svg" alt="Players" />
                            </Theme.DetailLabel>
                            <Theme.DetailLabel>
                                {trans('header.teamDetails.players')} (
                                {teamDetails?.players?.shortDistances +
                                    teamDetails?.players?.longDistances +
                                    teamDetails?.players?.midDistances}
                                ) :
                            </Theme.DetailLabel>
                            <Theme.PlayerBadge>
                                {teamDetails?.players?.shortDistances} Short Distances
                            </Theme.PlayerBadge>
                            <Theme.PlayerBadge
                                style={{ color: '#34dc25', backgroundColor: '#34dc250a' }}
                            >
                                {teamDetails?.players?.midDistances} Mid Distances
                            </Theme.PlayerBadge>
                            <Theme.PlayerBadge
                                style={{ color: '#202020', backgroundColor: '#2020200a' }}
                            >
                                {teamDetails?.players?.longDistances} Long Distances
                            </Theme.PlayerBadge>
                        </Theme.DetailRow>
                        {/* spaces info */}
                        {/* <Theme.DetailRow>
                            <Theme.DetailLabel>
                                <Theme.Icon src="/assets/icons/address-icon.svg" alt="Address" />
                            </Theme.DetailLabel>
                            <Theme.DetailLabel>
                                {trans('header.teamDetails.spaces')} (2) :
                            </Theme.DetailLabel>
                            <Theme.DetailValue>
                                <Theme.PlayerBadge
                                    style={{ color: '#202020', backgroundColor: '#2020200a' }}
                                >
                                    Long
                                </Theme.PlayerBadge>
                                <Theme.PlayerBadge
                                    style={{ color: '#202020', backgroundColor: '#2020200a' }}
                                >
                                    Distances
                                </Theme.PlayerBadge>
                            </Theme.DetailValue>
                        </Theme.DetailRow> */}
                        <div>
                            <Theme.ButtonsWrapper
                                type="button"
                                onClick={() => setIsModalOpen(true)}
                            >
                                <Theme.ButtonIcon
                                    src="/assets/icons/edit.svg"
                                    height={16}
                                    width={16}
                                    alt="Edit Icon"
                                />
                                {trans('clubInfo.editButton')}
                            </Theme.ButtonsWrapper>
                        </div>
                    </div>
                </Theme.HeaderClubWrapper>
                <div
                    style={{
                        margin: '0px 50px',
                    }}
                >
                    <Theme.AdminContainer>
                        <Theme.Icon src="/assets/icons/admins-icon.svg" alt="Admins" />
                        <Theme.DetailLabel>{trans('header.teamDetails.admins')}:</Theme.DetailLabel>
                    </Theme.AdminContainer>
                    {teamDetails?.admins?.map((admin: any, index: any) => (
                        <Theme.AdminContainer key={index}>
                            <Theme.AdminBadge>
                                <Theme.Icon
                                    src="/assets/icons/qustion-icon.svg"
                                    alt={admin?.role}
                                />
                                <Theme.AdminName>
                                    {trans(`category.${admin?.role}`)}
                                </Theme.AdminName>
                            </Theme.AdminBadge>
                            <span>~</span>
                            <Theme.AdminName>{admin?.name}</Theme.AdminName>
                        </Theme.AdminContainer>
                    ))}
                </div>
            </Theme.HeaderTeamWrapper>
        </Theme.Body>
    );
};
