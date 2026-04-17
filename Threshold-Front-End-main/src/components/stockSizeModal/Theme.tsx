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
export const FooterButtonsWrapper = styled.div`
    display: flex;
    position: sticky !important;
    background-color: white;
    justify-content: space-between;
    width: 100%;
    text-align: center;
    margin: 10px auto;
    bottom: 0px;
    top: 0px;
    z-index: 999;
    height: 10%;
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
export const TabsWrapper = styled.div`
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
    width: 100%;
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
export const SelectWrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 100%;
`;

export const SelectInput = styled.select`
    width: 100%;
    padding: 8px 12px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    background-color: #fff;
    color: #333;
    outline: none;

    &:focus {
        border-color: #007bff;
    }
`;
export const TabWrapper = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 16px;
`;

export const Tab = styled.button<{ isActive: boolean }>`
    padding: 8px 16px;
    border: none;
    background-color: ${({ isActive }) => (isActive ? '#007bff' : '#f1f1f1')};
    color: ${({ isActive }) => (isActive ? '#fff' : '#000')};
    cursor: pointer;
    border-radius: 4px;

    &:hover {
        background-color: ${({ isActive }) => (isActive ? '#0056b3' : '#e0e0e0')};
    }
`;
export const SwitchContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
`;

export const SwitchLabel = styled.span`
    font-size: 14px;
    color: #333;
`;

export const SwitchWrapper = styled.div`
    position: relative;
    display: inline-block;
    width: 60px;
    height: 30px;
`;

export const SwitchInput = styled.input`
    /* opacity: 0;
    width: 0;
    height: 0; */
`;

export const Slider = styled.span<{ isChecked: boolean }>`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ isChecked }) => (isChecked ? '#4CAF50' : '#ccc')};
    transition: 0.4s;
    border-radius: 30px;

    &:before {
        position: absolute;
        content: '';
        height: 26px;
        width: 26px;
        left: ${({ isChecked }) => (isChecked ? 'calc(100% - 28px)' : '2px')};
        bottom: 2px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }
`;
