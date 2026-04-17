import styled from 'styled-components';

export const Card = styled.div<{ isActive: boolean }>`
    padding: 15px;
    display: flex;
    justify-content: start;
    flex-direction: column;
    background-color: 'white';
    border: '1px solid black';
    border-right: ${(props) => (props.isActive ? '5px solid #c0d330' : '3px solid #ddd')};
    cursor: pointer;
    border-radius: 8px 0px 0px 8px;
    box-shadow: ${(props) => (props.isActive ? '0 4px 6px rgba(0, 0, 0, 0.1)' : 'none')};
    height: 500px;
`;
export const PhaseSpan = styled.span`
    font-size: 12px;
    font-weight: 600;
    opacity: 0.5;
`;
export const ActivitySpan = styled.span`
    font-size: 16px;
    font-weight: 600;
`;
export const DistanceSpan = styled.span`
    font-size: 12px;
    display: flex;
    opacity: 0.5;
`;
export const HrLine = styled.hr`
    border: 1px dashed black;
    opacity: 0.3;
`;
export const DistanceDatabase = styled.div`
    opacity: 0.5;
`;
export const DataWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
