import { media } from 'libs/Theme/breakpoints';
import Modal from 'react-modal';
import styled from 'styled-components';

export const ModalContainer = styled.div`
    padding: 20px;
    max-height: 800px;
    overflow-y: auto;
    border-radius: 8px;
    background-color: white;
`;

export const ListContainer = styled.div`
    padding: 10px;
    border: 1px solid white;
    border-radius: 8px;
    max-height: 400px;
    overflow-y: auto;
`;

export const ListItem = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    padding: 10px;
    background-color: #f9f9fc;
    border-radius: 8px;
    cursor: move;
    position: relative;
    transition: transform 0.6s ease;
    z-index: 0;
`;

export const ModalTitle = styled.h3`
    font-size: 18px;
    color: #333;
`;

export const ModalContent = styled.p`
    font-size: 14px;
    color: white;
`;
export const InputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    transition: all 0.5s ease;
    margin-top: 20px;
`;
export const FullWidthInputsWrapperTwoInputs = styled.div`
    display: flex;
    gap: 8px;
    width: 100%;
    transition: all 0.5s ease;
    margin-top: 20px;

    @media ${media.sm} {
        flex-direction: column;
        margin-top: 0px;
    }
`;
export const FullWidthInputsWrapper = styled(InputsWrapper)`
    width: 100%;
    grid-column: span 2;
`;
export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 8px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    background-color: white;

    &::placeholder {
        color: #bbb;
    }
`;
export const Body = styled.form.attrs({ className: 'flex flex-col' })`
    padding: 10px 30px;
    background-color: white;
    width: 100%;
    margin: auto;
`;
export const LineHR = styled.hr`
    color: black;
    font-size: 2px;
    margin: 20px 0px;
`;
export const InputsMultiWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;
export const InputMultiElemintsWrapperLeft = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;
export const InputMultiElemintsWrapperRight = styled.div`
    display: flex;
    align-items: end;
    justify-items: end;
    justify-content: end;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;
export const SpanContant = styled.span`
    color: #141400;
    font-weight: 500;
`;
export const SpanTecnique = styled.span`
    color: #f9f9fc;
`;
export const SpanMeters = styled.span`
    color: #202020d9;
    font-weight: 400;
`;

export const DiscardButtonWarning = styled.button`
    width: 20%;
    margin: 20px;
    font-weight: 600;
    background-color: #eb5353;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    font-size: 14px;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
export const BackButtonFromWarning = styled.button`
    width: 20%;
    font-size: 14px;
    font-weight: 600;
    margin: 20px;
    background-color: white;
    color: #c0d330;
    padding: 10px;
    border: 1px solid #c0d330;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    justify-content: space-around;
    align-items: center;
    transition:
        background-color 0.3s ease,
        transform 0.3s ease;
    &:disabled {
        background-color: #e0e0e0;
        cursor: not-allowed;
    }
`;
export const ButtonsElemintsWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 20px;
`;
export const ImageAndMassagesElemintsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
export const Warningh2 = styled.h2`
    font-size: 18px;
    font-weight: 600;
`;

export const WarningPara = styled.p`
    font-size: 14px;
    font-weight: 400;
`;
