import styled from 'styled-components';

export const AthletesList = styled.div.attrs({
    className:
        'grid grid-cols-[20%_20%_auto] my-[30px] gap-y-[20px] gap-x-[30px] p-[0px_80px_0px_0px]',
})``;

export const ListHeader = styled.div.attrs({ className: 'font-[600] text-[18px]' })``;

export const ListAthleteWrapper = styled.div.attrs({
    className: 'flex justify-start items-center gap-[15px] mb-auto',
})``;

export const ListAvatar = styled.img.attrs({
    className: 'w-[50px] h-[50px] rounded-full',
})``;

export const ListAthleteName = styled.p.attrs({ className: 'text-[18px]' })``;

export const WeeklySessionsContainer = styled.div`
    padding: 2rem;
    background-color: #f9f9f9;
    border-radius: 10px;
    max-width: 600px;
    margin: auto;
`;

export const SectionTitle = styled.h3`
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 1rem;
`;

export const Divider = styled.hr`
    border: none;
    border-top: 1px solid #e0e0e0;
    margin: 1.5rem 0;
`;

export const DaySelector = styled.div`
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
    flex-wrap: wrap;
`;

export const DayButton = styled.button<{ isSelected: boolean }>`
    padding: 0.5rem 1rem;
    border-radius: 5px;
    border: 1px solid #d0d0d0;
    background-color: ${({ isSelected }) => (isSelected ? '#c0d330' : '#fff')};
    color: ${({ isSelected }) => (isSelected ? '#fff' : '#333')};
    cursor: pointer;
`;

export const ActionButtons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
`;

export const BackButton = styled.button`
    padding: 0.5rem 1.5rem;
    border-radius: 5px;
    border: 1px solid #ccc;
    background-color: #fff;
    cursor: pointer;
`;

export const SaveButton = styled.button`
    padding: 0.5rem 1.5rem;
    border-radius: 5px;
    background-color: #c0d330;
    color: #fff;
    border: none;
    cursor: pointer;
`;
