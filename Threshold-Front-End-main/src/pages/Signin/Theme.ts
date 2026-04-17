import styled from 'styled-components';
import {
    InputController as DefaultInputController,
    Button as DefaultButton,
    Text as DefaultText,
    Link as DefaultLink,
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
    & > :last-child {
        margin-top: auto; /* Push the last child to the end of the column */
    }
`;

export const FormSection = styled.section.attrs({
    className: 'flex flex-col justify-center items-center',
})`
    width: 100%;
    height: 100%;
    background-color: #fff;
    color: #000;
    padding: 50px 70px;
    @media (${mq.laptop}) {
        padding: 0 70px;
        width: 40%;
    }
`;

export const FormTitle = styled(DefaultText)`
    font-weight: 600;
    font-size: 24px;
`;

export const FormSubtitle = styled(DefaultText)`
    margin-bottom: 50px;
    font-weight: normal;
    color: #20240399;
`;

export const InputController = styled(DefaultInputController).attrs({ className: 'flex flex-col' })`
    width: 100%;
    gap: 5px;
    font-size: 14px;
    color: #20240399;
    font-weight: 500;
`;

export const ControlsWrapper = styled.div.attrs({
    className: 'flex justify-between w-full',
})`
    flex-direction: column;

    @media (${mq.laptop}) {
        flex-direction: row;
    }
`;

export const CheckboxController = styled(DefaultInputController).attrs({
    className: 'flex items-center gap-1',
})`
    & label {
        font-weight: normal;
        order: 2;
    }
`;

export const SentenceWrapper = styled.div.attrs({
    className: 'flex gap-1 items-center',
})`
    justify-content: flex-end !important;
    font-size: 13px;
    width: 100%;

    @media (${mq.tablet}) {
        justify-content: center;
    }
`;

export const RegSentenceWrapper = styled(SentenceWrapper)`
    justify-content: center !important;
    margin-top: auto;
    margin-bottom: 24px;
`;

export const SentenceText = styled(DefaultText)`
    width: fit-content;
`;

export const SentenceLink = styled(DefaultLink)`
    color: #20240399;
    font-weight: 500;
    font-size: 14px;
`;

export const Button = styled(DefaultButton)`
    min-width: 100%;
    background-color: #c0d330;
    text-transform: capitalize;
    font-size: 14px;
    font-weight: 600;
`;

export const Errors = styled.div.attrs({ className: 'flex justify-center items-center' })`
    height: 40px;
    color: red;
`;
