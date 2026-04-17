import styled from 'styled-components';

export const InputBody = styled.div.attrs({
    className: 'relative w-full flex flex-col gap-[10px]',
})``;

export const InputWrapper = styled.div.attrs({ className: 'relative' })``;

export const Input = styled.input.attrs<{ $isIcon: boolean }>({
    className: 'w-full h-[50px] bg-blue-light rounded-[8px]',
})`
    transition: border-color 0.3s;
    padding: ${(props) => (props.$isIcon ? '5px 20px 5px 60px' : '5px 20px')};
    font-size: 16px;

    &:focus {
        border: none;
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

export const TextArea = styled.textarea.attrs({
    className: 'w-full bg-blue-light rounded-[8px]',
})`
    transition: border-color 0.3s;
    padding: 20px;
    font-size: 16px;
    resize: none;

    &:focus {
        border: none;
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

export const CheckboxBody = styled.div.attrs({
    className: 'flex flex-col justify-center items-start gap-3 mr-auto ml-[20px] opacity-[0.8]',
})``;

export const Checkbox = styled.input.attrs({ className: 'cursor-pointer' })`
    height: 20px;
    aspect-ratio: 1;
    transform: translateY(3px);

    &:disabled {
        cursor: not-allowed;
    }
`;

export const InputLabel = styled.label.attrs<{ htmlFor?: string }>({
    className: 'font-bold text-[17px] w-fit capitalize cursor-pointer',
})``;

export const PasswordButton = styled.button.attrs({
    className: 'absolute right-[15px] top-[50%] w-[25px] h-[25px] translate-y-[-50%] opacity-[0.8]',
})``;

export const PasswordImg = styled.img``;

export const PasswordImgLine = styled.div.attrs<{ $isVisible: true | undefined }>({
    className:
        'absolute w-[30px] h-[2px] bg-black top-[50%] left-[-2px] translate-y-[-50%] rotate-[-45deg]',
})`
    opacity: ${(props) => (props.$isVisible ? 0 : 0.7)};
`;

export const InputIcon = styled.img.attrs({
    className: 'absolute left-[20px] top-[50%] w-[25px] h-[25px] translate-y-[-50%] opacity-[0.8]',
})``;

export const InputHint = styled.p.attrs({ className: 'text-[red] 17px h-[15px]' })``;
