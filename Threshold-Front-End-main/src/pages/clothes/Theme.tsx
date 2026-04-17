import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';
import { media } from 'libs/Theme/breakpoints';

export const CoachListBody = styled.div.attrs({
    className: 'flex flex-col w-full',
})``;

export const CoachBody = styled.div.attrs({
    className: 'flex flex-col justify-start items-start w-full',
})`
    padding: 30px;
    gap: 50px;
`;

export const AvatarSection = styled.div.attrs({
    className: 'grid w-full',
})`
    grid-template-columns: 15% auto 15%;
    grid-template-rows: 1fr 1fr;
    @media (max-width: 768px) {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;

export const Avatar = styled(DefaultImage)`
    grid-row: span 2;
    width: 120px;
    aspect-ratio: 1;
    border-radius: 100%;
    margin: auto;
`;

export const Name = styled(DefaultText)`
    text-align: start;
    margin-top: auto;
    font-size: 30px;
    font-weight: bold;
`;

export const Button = styled(DefaultButton)<{ $isTable?: boolean }>`
    margin: auto;
    grid-row: ${(props) => (props.$isTable ? 'span 1' : 'span 2')};
    font-size: ${(props) => (props.$isTable ? '15px' : '20px')};
    width: 100%;
`;

export const SectionDivider = styled.div.attrs({ className: 'w-full grid grid-cols-[75%_25%]' })``;

export const ComponentsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;
    @media ${media.sm} {
        flex-direction: column;
        align-items: center;
        width: 98%;
        padding-left: 0px;
        margin: auto;
    }
`;
export const ButtonsWrapper = styled.button`
    min-width: 130px;
    width: 20%;
    margin: 10px 10px;
    background-color: #c0d330;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;

    &:hover {
        background-color: #c0d330;
    }

    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
export const DivWrapperClothes = styled.div`
    margin: 20px;
    @media ${media.sm} {
        width: 100%;
        display: flex;
        justify-content: center;
    }
`;
export const ContainerButtonsWrapper = styled.div`
    display: flex;
    align-items: baseline;
    justify-content: end;
`;
