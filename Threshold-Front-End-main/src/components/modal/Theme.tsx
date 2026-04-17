import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div.attrs({ className: 'fixed' })`
    z-index: 999999;
    width: 100vw;
    height: 100vh;
`;

export const Blur = styled.div.attrs({
    className: 'absolute',
})`
    width: 100vw;
    height: 100vh;
    /* backdrop-filter: blur(5px); */
    opacity: 0.9;
    background-color: #555b66;
`;

export const Content = styled.form.attrs<{ $isAlert: boolean }>({
    className: 'absolute grid',
})`
    grid-template-columns: auto;
    grid-template-rows: ${(props) =>
        props.$isAlert ? '40% 15% 25% 20%' : '35px 35px 30px auto 75px'};
    top: 50%;
    left: 50%;
    width: ${(props) => (props.$isAlert ? '25%' : '80%')};
    height: fit-content;
    max-height: ${(props) => (props.$isAlert ? '400px' : '95vh')};
    min-height: ${(props) => (props.$isAlert ? '40vh' : '85vh')};
    transform: translateX(-50%) translateY(-50%);
    background-color: #fcfcfd;
    padding: 30px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px 2px #00000055;
    overflow: hidden;
    min-width: 400px;
    @media (max-width: 768px) {
        width: 90%;
        min-width: inherit;
    }
`;

export const Title = styled(DefaultText)`
    font-size: 25px;
    font-weight: 700;
    @media (max-width: 768px) {
        font-size: 20px;
    }
`;

export const Subtitle = styled(DefaultText)``;

export const ButtonsContainer = styled.div.attrs({ className: 'flex justify-end gap-5 w-full' })``;
