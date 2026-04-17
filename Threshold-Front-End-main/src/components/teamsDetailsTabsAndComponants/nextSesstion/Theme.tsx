import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const Body = styled.form`
    padding: 15px;
    width: 100%;
`;
export const NextSesstionWrapper = styled.div`
    border: 1px solid #ffc000;
    min-height: 60px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    text-align: center;
    align-items: center;
    padding: 15px;

    @media ${media.xs} {
        flex-direction: column;
        gap: 16px;
    }
`;
export const NextSessionTitle = styled.div`
    color: #ffc000;
    font-size: 12px;
    font-weight: 600;
    margin: 10px;
`;
export const SessionDetails = styled.div`
    display: flex;
`;

export const SessionTitle = styled.span`
    font-size: 18px;
    color: #333;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const SessionDescription = styled.span`
    font-size: 14px;
    display: flex;
    color: #555;
    justify-content: center;
    align-items: center;
    margin: 0px 10px;
`;

export const TimeDetails = styled.div`
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    color: #555;
`;

export const TimeLabel = styled.span`
    font-weight: 600;
    color: #333;
`;

export const TimeValue = styled.span`
    font-weight: 400;
    color: #666;
`;
