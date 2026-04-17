import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const Body = styled.form`
    padding: 15px;
    width: 100%;
`;

export const HeaderTeamWrapper = styled.div`
    border: 1px solid #deddd0;
    min-height: 250px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    padding: 15px;

    @media ${media.sm} {
        flex-direction: column;
    }
`;

export const CenteredColumn = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
`;

export const CreatedDate = styled.div`
    font-weight: 400;
    font-size: 12px;
    margin-top: 20px;
`;

export const TeamName = styled.span`
    font-weight: 600;
    font-size: 32px;
    padding: 0px 5px;
`;

export const TeamDetails = styled.span`
    font-weight: 400;
    font-size: 24px;
    color: #2024034d;
    opacity: 0.6;
    padding: 0px 5px;
`;

export const DetailRow = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    margin-top: 5px;
    @media ${media.xs} {
        flex-direction: column;
        width: 100%;
    }
`;

export const Icon = styled.img`
    height: 16px;
    width: 16px;
`;

export const DetailLabel = styled.span`
    font-weight: 500;
    font-size: 14px;
    color: #2024034d;
    opacity: 0.6;
    padding: 0px 5px;
`;

export const DetailValue = styled.span`
    font-weight: 500;
    font-size: 14px;
    color: #2024034d;
    padding: 0px 5px;
`;

export const PlayerBadge = styled.span`
    font-weight: 500;
    font-size: 12px;
    color: #dc259f;
    background-color: #dc259f0a;
    padding: 5px;
    margin: 2px;
    border-radius: 8px;
`;

export const AdminContainer = styled.div`
    display: flex;
    justify-content: start;
    align-items: center;
    flex-direction: row;
    padding: 0px 5px;
`;

export const AdminBadge = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 500;
    font-size: 12px;
    background-color: #c0d33014;
    padding: 5px;
    margin: 2px;
    border-left: 2px solid #c0d330;
`;

export const AdminName = styled.span`
    font-weight: 500;
    font-size: 12px;
    color: #202403d9;
    padding: 0px 5px;
`;
export const ButtonIcon = styled.img`
    height: 16px;
    width: 16px;
    margin: 5px;
`;
export const ButtonsWrapper = styled.button`
    min-width: 100px;
    margin: 10px 10px;
    width: auto;
    color: #20240399;
    font-size: 14px;
    padding: 10px;
    border: 1px solid #deddd0;
    border-radius: 8px;
    cursor: pointer;
    font-weight: 600;
    display: flex;
    justify-content: space-around;
    align-items: center;
    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;

export const HeaderClubWrapper = styled.div`
    display: flex;
    width: auto;
    @media ${media.xs} {
        flex-direction: column;
    }
`;
