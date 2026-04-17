import { SharedModal } from 'components/sharedModal';
import { media } from 'libs/Theme/breakpoints';
import Modal from 'react-modal';
import styled from 'styled-components';

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
    padding: 10px 30px;
    background-color: white;
    width: 100%;
`;
export const LineHR = styled.hr`
    color: black;
    font-size: 2px;
    margin: 20px 0px;
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
export const SubmitButton = styled.button`
    margin-top: 20px;
    min-width: 25%;
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
export const ErrorMessage = styled.p`
    color: red;
    font-size: 12px;
    margin-top: 5px;
`;

export const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    width: 100%;
    transition: all 0.3s ease;
`;

export const SharedModalStyled = styled(SharedModal)`
    > * {
        overflow: hidden !important;
        display: flex;
        height: 100%;
    }
`;

export const ModalContainer = styled.div`
    border-radius: 8px;
    background-color: white;
    display: flex;
    height: 100%;
    flex-direction: column;
    overflow-y: scroll;
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
    top: 0;
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
    // border: 1px solid blue;
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

export const NavButton = styled.button`
    color: #202020d9;
    font-size: 14px;
    font-weight: 600;
`;

export const EvenWrapper = styled.div`
    display: flex;
    gap: 24px;
    @media ${media.sm} {
        flex-direction: column;
        gap: 0px;
    }
`;

export const OddWrapper = styled.div`
    @media ${media.sm} {
        gap: 0px;
    }
`;

export const FullWidthInputsWrapper = styled(InputsWrapper)`
    width: 100%;
    grid-column: span 2;
`;

export const GridWrapper2 = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
    transition: all 0.3s ease;
`;
