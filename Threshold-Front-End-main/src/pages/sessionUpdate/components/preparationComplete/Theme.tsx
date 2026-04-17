import styled from 'styled-components';

export const Body = styled.div`
    background: #fcfcfd;
    border: 1px solid #ccc;
    padding: 30px;
    width: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 4px;
    justify-content: center;
    align-items: center;

    &:not(:first-child) {
        margin-top: 20px;
    }

    > div:not(:last-child) {
        margin-bottom: 20px;
    }

    @media (max-width: 768px) {
        padding: 20px;
    }

    @media (max-width: 480px) {
        padding: 15px;
    }
`;

export const Avatar = styled.img.attrs({
    className: 'w-[50px] h-[50px] rounded-full me-[25px]',
})`
    @media (max-width: 480px) {
        width: 40px;
        height: 40px;
        margin-right: 15px;
    }
`;

export const Alignment = styled.div.attrs({
    className: 'w-[50px] h-[50px] me-[25px]',
})`
    @media (max-width: 480px) {
        width: 0px;
        height: 40px;
        // margin-right: 15px;
    }
`;

export const Name = styled.p.attrs({
    className: 'text-[18px] truncate capitalize text-ellipsis',
})`
    @media (max-width: 768px) {
        font-size: 16px;
    }

    @media (max-width: 480px) {
        font-size: 14px;
    }
`;

export const Section = styled.div.attrs({
    className: 'flex w-full justify-start items-center',
})`
    margin-bottom: 10px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }

    @media (max-width: 480px) {
        margin-bottom: 8px;
    }
`;

export const TitleSection = styled.div.attrs({
    className: 'flex justify-start items-center truncate text-ellipsis font-medium',
})`
    flex: 1;

    @media (max-width: 768px) {
        justify-content: center;
        // gap: 20px;
        width: 100%;
        margin-bottom: 30px !important;
    }
`;

export const FieldSection = styled.div.attrs({
    className: 'flex justify-start flex-col items-center w-full',
})`
    flex: 3;
    display: flex;
    align-items: center;
    padding-inline-start: 50px;
    border-inline-start: 1px solid #d3cece;
    min-height: 51px;

    @media (max-width: 768px) {
        padding-inline-start: 30px;
        border-inline-start: none;
        padding: 0;
        min-height: inherit;
    }

    > div {
        width: 100%;
        display: flex;
        justify-content: space-between;

        @media (max-width: 768px) {
            flex-direction: column;
            align-items: flex-start;
        }
    }

    > div > div {
        width: 100%;
        display: flex;
        justify-content: space-between;
    }
`;

export const Error = styled.div`
    color: red;
    font-size: 12px;
    margin-block: 10px;
    min-height: 20px;

    @media (max-width: 768px) {
        font-size: 11px;
    }

    @media (max-width: 480px) {
        font-size: 10px;
    }
`;
