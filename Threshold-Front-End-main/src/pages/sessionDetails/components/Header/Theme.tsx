import styled from 'styled-components';

export const UserInfoCard = styled.div`
    background-color: #fff;
    max-height: 56px;
    border-radius: 8px;
    box-shadow: 0px 0px 4px 0px rgba(32, 32, 32, 0.08);
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
`;

export const ClubLogoWrapper = styled.div`
    width: 40px;
    height: 40px;
`;

export const UserInfoStatus = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 4px;
`;

export const DarkLabel = styled.span`
    font-size: 18px;
    font-weight: 600;
    color: #141400;
`;

export const LeighLabel = styled.span`
    font-size: 14px;
    font-weight: 500;
    color: #2024034d;
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

export const HeaderWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
`;

export const TopHeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;

export const SessionInfoWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0px 16px;
`;

export const SessionTitleWrapper = styled.div`
    display: flex;
    gap: 4px;
`;
export const ItemsHeaderWrapper = styled.div`
    display: flex;
    gap: 4px;
`;
export const TimeWrapper = styled.div`
    border: 1px solid #c0d330;
    padding: 8px 16px;
    display: flex;
    gap: 16px;
    border-radius: 4px;
`;

export const TimeColumn = styled.div`
    margin: auto;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

export const FitnessWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
`;

export const FitnessInfo = styled.div`
    display: flex;
    gap: 8px;
`;

export const EditButton = styled.button`
    display: flex;
    align-items: center;
    gap: 8px;
    background: none;
    border: 1px solid #dbddd0;
    padding: 10px 24px;
    cursor: pointer;
    border-radius: 8px;
    color: #20240399;
    img {
        height: 18px;
        width: 18px;
    }
`;

export const FitnessText = styled.p<{ bgColor: string; textColor: string }>`
    padding: 8px;
    border-radius: 4px;
    margin: 0;
    font-size: 14px;
    font-weight: 500;
    background-color: ${(props) => props.bgColor};
    color: ${(props) => props.textColor};
`;

export const ButtonsWrapper = styled.div`
    display: flex;
    gap: 16px;
    justify-content: space-between;
    width: 100%;
`;

export const CreateRegularSessionButton = styled.button`
    background-color: white;
    color: #c0d330;
    border: 1px solid #c0d330;
    cursor: pointer;
    align-self: flex-end;
    display: flex;
    gap: 4px;
    padding: 12px 24px;
    border-radius: 8px;
    align-items: center;
`;

export const CreateSessionButton = styled.button<{ bgColor?: string }>`
    background-color: ${(props) => props.bgColor || '#c0d330'};
    border: 1px solid ${(props) => props.bgColor || '#c0d330'};
    color: white;
    cursor: pointer;
    align-self: flex-end;
    display: flex;
    gap: 4px;
    padding: 12px 24px;
    border-radius: 8px;
    align-items: center;
    &:hover {
        opacity: 0.9;
    }

    img {
        margin-right: 8px;
    }
`;

export const RegularSessionDetails = styled.div`
    margin-left: 16px;
    color: #333;
    font-size: 14px;
    display: flex;
    align-items: center;
`;

export const SessionDetails = styled.div`
    display: flex;
    align-items: center;
    margin-left: 16px;
`;

export const FullScreenButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    padding: 0 8px;
    display: flex;
    align-items: center;

    img {
        width: 18px;
        height: 18px;
    }
`;

export const DurationText = styled.span`
    font-size: 14px;
    margin: 0 16px;
    color: #555;
`;

export const TimerIcon = styled.div`
    display: flex;
    align-items: center;

    img {
        width: 18px;
        height: 18px;
    }
`;

export const Wrapper = styled.div`
    display: flex;
    justify-content: space-between;
    gap: 20px;
    margin-top: 20px;
`;

export const LeftWrapper = styled.div`
    width: 25%;
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

export const RightWrapper = styled.div`
    width: 75%;
    display: flex;
    flex-direction: column;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 16px;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;

    th,
    td {
        border: 1px solid #ddd;
        text-align: left;
        padding: 8px;
    }

    th {
        background-color: #f4f4f4;
        font-weight: bold;
    }

    tr:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

export const Card = styled.div<{ isActive: boolean }>`
    padding: 12px 16px;
    border: 1px solid ${({ isActive }) => (isActive ? '#007BFF' : '#ddd')};
    background-color: ${({ isActive }) => (isActive ? '#E9F5FF' : '#fff')};
    color: ${({ isActive }) => (isActive ? '#007BFF' : '#333')};
    border-radius: 8px;
    cursor: pointer;
    text-align: center;
    font-size: 16px;
    font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
    transition: all 0.3s ease;

    &:hover {
        border-color: #007bff;
        background-color: #e9f5ff;
        color: #007bff;
    }
`;
