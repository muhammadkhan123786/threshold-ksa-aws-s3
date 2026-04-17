import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

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
`;
