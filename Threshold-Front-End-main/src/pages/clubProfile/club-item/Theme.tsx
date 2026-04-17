import styled from 'styled-components';

export const Card = styled.div.attrs({
    className:
        'flex items-center justify-between p-6 bg-white border border-gray-300 rounded-lg shadow-md w-full md:h-[213px] h-auto flex-wrap md:flex-nowrap',
})``;

export const AvatarSection = styled.div.attrs({
    className:
        'flex flex-col items-center justify-center text-center md:w-[150px] w-full mb-4 md:mb-0 md:mr-4',
})``;

export const Avatar = styled.div.attrs({
    className: 'w-[120px] h-[120px] rounded-lg flex items-center justify-center md:mb-2',
})`
    border-radius: 8px;
    border: 1px #dbddd0 solid;
`;

export const Title = styled.div.attrs({
    className: 'text-lg font-bold text-gray-900 mt-2',
})``;

export const DetailsSection = styled.div.attrs({
    className: 'flex flex-col justify-between flex-1 w-full',
})``;

export const Metrics = styled.div.attrs({
    className: 'flex justify-start mb-3 md:flex-row flex-wrap gap-2 w-full',
})``;

export const MetricItem = styled.div.attrs({
    className: 'text-center text-sm text-gray-800',
})`
    cursor: pointer;
    margin: 0px 40px;
`;

export const MetricValue = styled.div.attrs({
    className: 'text-base font-bold text-gray-900',
})`
    font-size: 16px;
    font-weight: 600;
`;

export const MetricLabel = styled.div.attrs({
    className: 'text-xs text-gray-500',
})`
    font-size: 12px;
    font-weight: 400;
    /* font-family: 'Alexandria'; */
`;

export const ManagersSection = styled.div.attrs({
    className: 'flex flex-wrap w-full',
})``;

export const ManagerItem = styled.div.attrs({
    className:
        'flex items-center gap-1 px-2 py-1 bg-gray-100 border border-gray-300 rounded text-xs text-gray-800',
})``;

export const HighlightedText = styled.span.attrs({
    className: 'font-bold text-gray-900',
})``;

export const ViewAllButton = styled.button.attrs({
    className:
        'bg-[#c0d330] text-white rounded-md px-6 py-3 text-sm font-bold cursor-pointer transition-all duration-300 hover:bg-[#a4b228] md:ml-4 mt-4 md:mt-0',
})``;

export const Sectiontitle = styled.h3.attrs({
    className: 'text-lg font-semibold text-gray-800',
})``;

export const Managername = styled.span.attrs({
    className: 'text-gray-700 font-medium',
})``;

export const Managerrole = styled.span.attrs({
    className: 'text-gray-500 font-normal',
})``;
export const ButtonPrimary = styled.button`
    background-color: transparent;
    border: none;
    color: #20240399;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
    border: 1px solid #dbddd0;
    padding: 8px 12px;
    border-radius: 8px;
    &:hover {
        color: #a4b228;
    }

    &::before {
        font-size: 18px;
    }
`;
export const Icon = styled.img`
    margin: 0px 10px;
`;
export const FlexWrapper = styled.div`
    display: flex;
    gap: 90px;
`;
