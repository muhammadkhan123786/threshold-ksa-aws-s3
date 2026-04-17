import styled from 'styled-components';

export const Body = styled.div.attrs({
    className:
        'flex bg-white border border-gray-300 justify-around rounded-lg shadow-md p-6 flex-wrap md:flex-nowrap',
})`
    background-color: #f5f6f7;
`;

export const LeftSection = styled.div.attrs({
    className: 'flex flex-col justify-center md:w-[25%]  w-[15%] w-full mb-4 md:mb-0',
})``;

export const Avatar = styled.div.attrs({
    className: 'w-24 h-24 md:w-32 md:h-32 rounded-[15px] overflow-hidden mb-2',
})`
    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 8px;
    border: 1px #dbddd0 solid;
    background-color: #f5f6f7;
    &:empty {
        background: #f0f0f0;
    }

    img {
        display: block;
        width: 100%;
        height: 100%;
    }
`;

export const CreatedDate = styled.div.attrs({
    className: 'text-sm text-gray-500',
})``;

export const CenterSection = styled.div.attrs({
    className: 'md:w-[50%] w-full text-start',
})``;

export const Title = styled.h1.attrs({
    className: 'text-xl font-bold text-gray-900 mb-4',
})``;

export const Fields = styled.div.attrs({
    className: 'space-y-4',
})``;

export const Field = styled.div.attrs({
    className: 'flex flex-col',
})``;

export const Label = styled.span.attrs({
    className: 'text-sm text-gray-500 mb-1',
})``;

export const Value = styled.span.attrs({
    className: 'text-sm font-medium text-gray-900',
})``;

export const RightSection = styled.div.attrs({
    className: 'flex flex-col items-end md:w-[30%] w-full text-end space-y-4',
})``;

export const AddressField = styled.div.attrs({
    className: 'text-start',
})``;

export const EditButton = styled.button.attrs({
    className: 'bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-all',
})``;
export const ManagerButton = styled.button`
    justify-content: center;
    align-items: center;
    border: 1px solid;
    padding: 8px 12px;
    border-radius: 8px;
    width: 100%;
    max-width: 120px;
    display: flex;
    font-weight: 600;
`;
export const Icon = styled.img`
    margin: 0px 10px;
`;
export const FlexWrapper = styled.div`
    display: flex;
    gap: 90px;
`;
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
