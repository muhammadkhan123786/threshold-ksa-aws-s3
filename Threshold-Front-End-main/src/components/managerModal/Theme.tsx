import { SharedModal } from '../sharedModal';
import styled from 'styled-components';

export const SharedModalStyled = styled(SharedModal)`
    > * {
        overflow: hidden !important;
        display: flex;
        height: 100%;
    }
`;

export const ModalContainer = styled.div`
    padding: 20px;
    max-height: 800px;
    border-radius: 8px;
    background-color: white;
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow: hidden;
`;

export const LoaderButton = styled.button`
    margin-top: 20px;
    width: 25%;
    background-color: #c0d330;
    color: white;
    padding: 10px;
    border: none;
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

export const ListContainer = styled.div`
    padding: 10px;
    border: 1px solid white;
    border-radius: 8px;
    max-height: 400px;
    overflow-y: auto;
`;

export const ProgressContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    gap: 10px;
    z-index: 999;
    background-color: #fff;
    position: sticky;
    top: -14px;
    @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 15px;
    }
`;

export const ProgressStep = styled.div<{
    isActive?: boolean;
    isCompleted?: boolean;
    isDisabled?: boolean;
}>`
    flex: 1;
    text-align: center;
    cursor: ${({ isCompleted, isDisabled }) =>
        isDisabled ? 'not-allowed' : isCompleted ? 'pointer' : 'default'};
    padding: 0.5rem 1rem;
    border-bottom: 2px solid
        ${({ isActive, isCompleted, isDisabled }) =>
            isActive ? '#c0d330' : isCompleted ? '#ccc' : isDisabled ? '#ddd' : '#eee'};
    color: ${({ isActive, isCompleted, isDisabled }) =>
        isDisabled ? '#bbb' : isActive ? '#c0d330' : isCompleted ? '#666' : '#aaa'};
    font-weight: ${({ isActive }) => (isActive ? 'bold' : 'normal')};
    opacity: ${({ isDisabled }) => (isDisabled ? '0.5' : '1')};
    pointer-events: ${({ isDisabled }) => (isDisabled ? 'none' : 'auto')};
    transition: all 0.3s ease;

    &:not(:last-child) {
        margin-right: 0.5rem;
    }

    &:hover {
        color: ${({ isActive, isDisabled }) => (isDisabled ? '#bbb' : isActive ? '#000' : '#444')};
        border-bottom-color: ${({ isActive, isCompleted, isDisabled }) =>
            isDisabled ? '#ddd' : isActive ? '#a7b02f' : isCompleted ? '#bbb' : '#ddd'};
    }

    @media (max-width: 768px) {
        font-size: 14px;
        padding: 0.5rem;
    }
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
    background-color: white;
    width: 100%;
    margin: auto;
    overflow-y: auto;
    flex: 1;
    display: flex;
    overflow-x: hidden;
`;
export const LineHR = styled.hr`
    color: black;
    font-size: 2px;
    margin: 20px 0px;
`;
export const InputsMultiWrapper = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    transition: all 0.3s ease;
`;
export const InputMultiElemintsWrapperLeft = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    transition: all 0.3s ease;
`;
export const InputMultiElemintsWrapperRight = styled.div`
    display: flex;
    align-items: end;
    justify-items: end;
    justify-content: end;
    flex-direction: row;
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
export const SubmitButton = styled.button`
    margin-top: 20px;
    width: 25%;
    background-color: #c0d330;
    color: white;
    padding: 10px;
    border: none;
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
export const TabsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 10;
    padding: 10px 0;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
`;

export const TabButton = styled.button<{ isActive: boolean }>`
    padding: 10px 20px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    width: 100%;
    color: ${({ isActive }) => (isActive ? '#c0d330' : '#202020d9')};
    border-bottom: 1px solid ${({ isActive }) => (isActive ? '#c0d330' : '#bebebe')};
    transition: background-color 0.3s ease;
`;
export const ParaButtonDiv = styled.div`
    display: flex;
    justify-content: end;
`;
export const ParaButton = styled.button`
    color: #20202099;
    font-size: 14px;
    font-weight: 500;
    border-bottom: 1px solid #b3b3b3d9;
`;
export const NavButton = styled.button`
    color: #202020d9;
    font-size: 14px;
    font-weight: 600;
`;
export const FooterButtonsWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    width: 96%;
    text-align: center;
    margin: 10px auto;
    position: static;
    bottom: 0;
    z-index: 999;
`;
export const ButtonsWrapperIcon = styled.div`
    display: flex;
`;
export const PreviousButton = styled.div`
    display: flex;
    justify-content: center;
`;
export const TabContent = styled.div``;
export const ActionsWrapper = styled.div``;
export const CancelButton = styled.button``;
export const SaveButton = styled.button``;
export const Error = styled.button`
    color: red;
`;
