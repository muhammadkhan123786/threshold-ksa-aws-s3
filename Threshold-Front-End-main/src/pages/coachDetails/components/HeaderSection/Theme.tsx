import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    @media ${media.sm} {
        justify-content: center;
        align-items: center;
        gap: 0px;
    }
`;

export const HeaderInfoWrapper = styled.div`
    width: 31.4%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    @media ${media.sm} {
        width: 100%;
    }
`;

export const SportSpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #c0d330;
    background-color: #c0d33014;
`;

export const AcademySpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #20240399;
`;

export const BoxWrapper = styled.span`
    display: flex;
    flex-direction: row;
    gap: 8px;
`;

export const PlayerNameSpan = styled.span`
    display: flex;
    font-size: 40px;
    font-weight: 700;
    padding: 3px 10px;
    color: #000;
`;

export const SportUserDetails = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const DataLabel = styled.span`
    font-size: 12px;
    font-weight: 500;
    color: #2024034d;
`;

export const DataContact = styled.div`
    font-size: 20px;
    font-weight: 600;
    color: #202403d9;
`;

export const UserInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

export const ContractInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
`;

export const ContractTitleSpan = styled.span`
    display: flex;
    font-size: 14px;
    font-weight: bold;
    padding: 3px 10px;
    color: #039855;
`;

export const ContractDateSpan = styled.span`
    display: flex;
    font-size: 12px;
    padding: 3px 10px;
    color: #20240399;
    font-weight: 400;
`;

export const UserInfoCard = styled.div`
    width: 100%;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0px 0px 4px 0px rgba(32, 32, 32, 0.08);
    padding: 16px;
    display: flex;
    justify-content: space-between;
    margin-top: 32px;
`;

export const ClubLogoWrapper = styled.div`
    width: 40px;
    height: 40px;
`;

export const UserInfoStatus = styled.div`
    display: flex;
    flex-direction: column;
`;

export const LeighLabel = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #2024034d;
`;

export const DarkLabel = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: #141400;
`;

export const UserType = styled.div`
    display: flex;
    flex-direction: column;
`;

export const TypeLabel = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: #dc8025;
    background-color: rgba(220, 129, 37, 0.04);
    padding: 3px 12px;
`;

export const NextSessionWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

export const NextSessionLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: #ffc000;
`;

export const NextDurationsWrapped = styled.div`
    display: flex;
    flex-direction: column;
    padding: 20px 16px;
`;

export const NextDurationsLabelHR = styled.span`
    font-size: 20px;
    font-weight: 600;
    color: #c0d330;
    display: block;
`;

export const NextDurationsLabel = styled.span`
    font-size: 12px;
    font-weight: 600;
    color: #c0d330;
`;

export const IMGWrapper = styled.div`
    /* width: 37%; */
`;
