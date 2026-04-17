import styled from 'styled-components';

// Main Wrapper for Input Component
export const Body = styled.div``;
export const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`;

// Input Field Styles
export const Input = styled.input`
    width: 100%;
    height: 40px;
    padding: 8px 16px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    transition:
        border-color 0.3s,
        box-shadow 0.3s;

    &:focus {
        border-color: #4caf50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        outline: none;
    }

    &:hover {
        border-color: #45a049;
    }

    &::placeholder {
        color: #a9a9a9;
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

// TextArea Component
export const TextArea = styled.textarea`
    width: 100%;
    height: auto;
    padding: 10px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    resize: none;
    transition:
        border-color 0.3s,
        box-shadow 0.3s;

    &:focus {
        border-color: #4caf50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        outline: none;
    }

    &::placeholder {
        color: #a9a9a9;
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

// Select Component Styles
export const Select = styled.select`
    width: 100%;
    height: 40px;
    padding: 8px 16px;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
    transition:
        border-color 0.3s,
        box-shadow 0.3s;

    &:focus {
        border-color: #4caf50;
        box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
        outline: none;
    }
`;

// Icon for Input Field
export const IconImage = styled.img`
    position: absolute;
    width: 20px;
    height: auto;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    opacity: 0.7;
`;

// Add Button
export const AddButton = styled.button`
    display: flex;
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 5px;
    font-size: 16px;
    border-radius: 50%;
    border: none;
    // background-color: #c0d330;
    color: #c0d330;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
        background-color: #c0d330;
        color: white;
    }

    &:disabled {
        background-color: #c0d330;
        cursor: not-allowed;
    }
`;

// Remove Button
export const RemoveButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #20240399;
    cursor: pointer;
    transition:
        background-color 0.3s,
        color 0.3s;
    &:disabled {
        background-color: #f5f5f5;
        color: #ccc;
        cursor: not-allowed;
    }
`;

// Phone Item Wrapper
export const PhoneItem = styled.div`
    display: flex;
    border: 1px solid #ccc;
    border-radius: 25px;
    padding: 8px 16px;
    gap: 8px;
    background-color: hsla(67, 64.9%, 50.8%, 0.08);
`;

export const ContactsNumberWrapper = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
`;
