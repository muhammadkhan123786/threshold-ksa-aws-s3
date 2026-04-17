import styled, { css } from 'styled-components';
import {
    InputController as DefaultInputController,
    InputNumberController as DefaultNumberInputController,
    ImageInputController as DefaultImageInputController,
    Button as DefaultButton,
    Text as DefaultText,
    Link as DefaultLink,
    Image as DefaultImage,
} from 'components';
import { mq } from 'theme/mq';

export const Body = styled.form.attrs({
    className: 'flex items-center justify-center w-full',
})`
    height: auto;
    flex-direction: column;

    @media (${mq.laptop}) {
        height: 100%;
        flex-direction: row;
    }
`;

export const FormSection = styled.section.attrs({
    className: 'flex flex-col justify-center items-center',
})`
    width: 100vw;
    background-color: #fff;
    color: #000;
    padding: 50px 70px;
    overflow: hidden;
    position: relative;
    height: 120vh;
    @media (${mq.laptop}) {
        height: 100%;
        padding: 0 70px;
        width: 40vw;
    }
`;

export const FormSlider = styled.div.attrs({
    className: 'flex flex-col justify-center',
})<{ stage: number; $isRTL: boolean }>`
    transition: 0.7s ease-in-out;
    position: absolute;
    top: 0;
    ${(props) =>
        props.$isRTL
            ? css`
                  right: ${(props.stage - 1) * -100}vw;
              `
            : css`
                  left: ${(props.stage - 1) * -100}vw;
              `}

    width: 200vw;

    @media (${mq.laptop}) {
        ${(props) =>
            props.$isRTL
                ? css`
                      right: ${(props.stage - 1) * -40}vw;
                  `
                : css`
                      left: ${(props.stage - 1) * -40}vw;
                  `}

        width: 80vw;
    }
`;

export const StageWrapper = styled.div.attrs({
    className: 'flex flex-col justify-center items-center relative',
})`
    padding: 0 70px;
    @media (${mq.laptop}) {
        width: 40vw;
    }
`;

export const ButtonWrapper = styled.div`
    width: 100%;
`;

export const BackButton = styled(DefaultImage)``;

export const BackButtonBody = styled.button<{ $isRTL: boolean }>`
    transition: opacity 0.3s ease;
    position: absolute;
    height: auto;
    padding: 10px;
    top: 70px;
    ${(props) => (props.$isRTL ? 'right: 80px;' : 'left: 80px;')}
    cursor: pointer;
    z-index: 1231;
    &:hover {
        opacity: 0.5;
    }
`;
export const FormTitle = styled(DefaultText)`
    font-weight: bold;
`;

export const SubtitleWrapper = styled.div.attrs({
    className: 'flex justify-center items-center relative',
})`
    padding: 20px 0;
    height: 60px;
    width: 100%;
`;

export const FormSubtitle = styled(DefaultText)`
    background-color: #fff;
    padding: 0 10px;
    font-weight: bold;
    z-index: 2;
`;

export const SubtitleLine = styled.div`
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateX(-50%) translateY(-50%);
    width: 100%;
    height: 2px;
    background-color: #a9a9a9;
    opacity: 0.5;
`;

export const InputController = styled(DefaultInputController).attrs({ className: 'flex flex-col' })`
    width: 100%;
    gap: 5px;
    font-size: 14px;
    color: #20240399;
    font-weight: 500;
`;

export const InputNumberController = styled(DefaultNumberInputController).attrs({
    className: 'flex flex-col',
})`
    width: 100%;
    gap: 5px;
    font-size: 14px;
    color: #20240399;
    font-weight: 500;
`;

interface ExtendedProps {
    className?: string;
}

export const ImageInputController = styled(DefaultImageInputController)<ExtendedProps>`
    width: 100%;
    gap: 5px;
    font-size: 14px;
    color: #20240399;
    font-weight: 500;
    border: 1px solid red !important;
`;

export const Button = styled(DefaultButton)`
    min-width: 100%;
`;

export const SentenceWrapper = styled.div.attrs({
    className: 'flex gap-1 items-center',
})`
    justify-content: end;
    font-size: 13px;
    width: 100%;

    @media (${mq.tablet}) {
        justify-content: center;
    }
`;

export const SentenceText = styled(DefaultText)`
    width: fit-content;
`;

export const SentenceLink = styled(DefaultLink)``;

export const ErrorText = styled.div`
    color: red;
`;

export const Errors = styled.div.attrs({ className: 'flex justify-center items-center' })`
    height: 40px;
    color: red;
`;

export const MultiStepFormWrapper = styled.div.attrs({
    className: 'flex flex-col',
})`
    width: 100%;
    height: 100%;
`;
export const RegSentenceWrapper = styled(SentenceWrapper)`
    justify-content: center !important;
    margin-top: auto;
    margin-bottom: 24px;
`;

export const OptionsContainer = styled.div`
    display: flex;
    gap: 1rem;
    width: 100%;
    justify-content: space-between;
`;

export const OptionCard = styled.div<{ isSelected: boolean }>`
    cursor: pointer;
    padding: 1rem;
    border: 2px solid ${({ isSelected }) => (isSelected ? '#C0D330' : '#DBDDD0')};
    border-radius: 8px;
    text-align: center;
    transition: all 0.3s ease;
    width: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    &:hover {
        transform: scale(1.05);
    }
`;

export const OptionIcon = styled.div<{ isSelected: boolean }>`
    color: ${({ isSelected }) => (isSelected ? 'blue' : 'gray')};
    transition: color 0.3s ease;
`;

export const OptionLabel = styled.span`
    font-size: 14px;
    font-weight: 500;
    margin-top: 0.5rem;
    display: block;
`;

export const contactsNumbersWrapper = styled.div`
    // border: 1px solid green;
`;

export const numbersWrapper = styled.div`
    // border: 1px solid red;
`;

export const contactNumber = styled.div`
    // border: 1px solid red;
`;

export const ImageInputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 5px;
    margin-bottom: 30px;
`;

export const Tag = styled.div`
    display: inline-flex;
    align-items: center;
    background-color: #f3f4f6;
    color: #333;
    border: 1px solid #ccc;
    border-radius: 16px;
    padding: 5px 10px;
    margin: 5px;
    font-size: 14px;

    .remove-btn {
        margin-left: 8px;
        color: #ff0000;
        cursor: pointer;
        font-weight: bold;
    }

    .remove-btn:hover {
        opacity: 0.8;
    }
`;
