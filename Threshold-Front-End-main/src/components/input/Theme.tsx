import styled from 'styled-components';

interface PasswordButtonProps {
    visible: true | undefined;
    isRTL: boolean;
}

export const Body = styled.div`
    width: 100%;
    position: relative;
`;

export const InputWrapper = styled.div`
    position: relative;
`;

export const Input = styled.input`
    width: 100%;
    height: 40px;
    transition: border-color 0.3s;
    padding: 5px 20px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;

    &:focus {
        border-color: #c0d330;
        outline: none;
    }

    &:hover {
        border-color: #c0d330;
    }

    &::placeholder {
        color: #a9a9a9;
    }

    &:disabled {
        background-color: #f5f5f5;
        cursor: not-allowed;
    }
`;

export const Select = styled.select`
    width: 100%;
    height: 40px;
    transition: border-color 0.3s;
    padding: 0px 15px;
    margin: 0;
    border: 1px solid #ccc;
    border-radius: 8px;
    font-size: 16px;
    cursor: pointer;
`;

export const Option = styled.option`
    font-size: 16px;
    cursor: pointer;
    padding: 0px 15px;
    height: 40px;
`;

export const DateWrapper = styled.div`
    position: relative;

    & .react-datepicker-wrapper {
        width: 100%;
    }

    & input {
        width: 100%;
        height: 40px;
        transition: border-color 0.3s;
        padding: 0px 15px 0px 50px;
        margin: 0;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    }
`;

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

export const UploaderWrapper = styled.div.attrs({
    className: 'flex flex-col gap-3 justify-center items-center',
})`
    padding: 20px 0px;
    background-color: #fff;
    border: 1px solid #cdc9e299;
    border-radius: 15px;

    & label {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;
    }
`;

export const UploadIcon = styled.img.attrs({
    className: '',
})`
    width: 50px;
    aspect-ratio: 1 / 1;
`;
export const PasswordButton = styled.button.attrs<PasswordButtonProps>((props) => ({
    className: `absolute ${
        props.isRTL ? 'left-[15px]' : 'right-[15px]'
    } top-[50%] w-[25px] h-[25px] translate-y-[-50%] opacity-[0.8]`,
}))<PasswordButtonProps>`
    display: ${(props) => (props.visible ? 'initial' : 'none')};
    direction: ltr;
`;

export const PasswordImg = styled.img``;

export const PasswordImgLine = styled.div.attrs<{ visible: true | undefined }>({
    className:
        'absolute w-[25px] h-[2px] bg-black top-[50%] left-[-2px] translate-y-[-50%] rotate-[-45deg]',
})`
    opacity: ${(props) => (props.visible ? 0 : 0.5)};
`;

export const TextArea = styled.textarea.attrs({
    className: 'w-full bg-blue-light rounded-[8px]',
})`
    transition: border-color 0.3s;
    padding: 20px;
    font-size: 16px;
    resize: none;
    border: 1px solid #ccc;
    border-radius: 8px;
    margin-top: 8px;
    &:focus {
        outline: none;
    }

    &::placeholder {
        color: black;
        opacity: 0.6;
    }

    &:disabled {
        cursor: not-allowed;
    }
`;
