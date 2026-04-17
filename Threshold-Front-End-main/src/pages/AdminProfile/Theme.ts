import styled from 'styled-components';
import {
    Button as DefaultButton,
    Text as DefaultText,
    Image as DefaultImage,
    InputController,
} from 'components';

export const Body = styled.div.attrs({
    className: 'w-full grid   grid-rows-[auto-auto] p-[50px] gap-y-[50px]',
})`
    @media (max-width: 768px) {
        grid-template-columns: 100%;
        grid-template-rows: auto auto;
        padding: 20px;
        gap: 20px;
    }
`;
export const Wapper = styled.div.attrs({
    className: 'flex flex-col gap-[20px] md:flex-row md:gap-[40px]',
})``;
export const AvatarBox = styled.div.attrs({
    className:
        'flex flex-col justify-center items-center gap-[20px] bg-white p-[20px] rounded-lg border',
})`
    @media (min-width: 768px) {
        width: 40%;
    }
`;

export const Avatar = styled(DefaultImage).attrs({
    className: 'w-[60%] aspect-square h-auto rounded-lg',
})``;

export const ChangeImageButton = styled(DefaultButton).attrs({
    className: 'px-[10px]',
})``;

export const PersonalInfoBox = styled.form.attrs({
    className: 'flex flex-col gap-[20px] bg-white p-[20px] rounded-lg border',
})`
    @media (min-width: 768px) {
        width: 70%;
    }
`;

export const GeneralInfoBox = styled.form.attrs({
    className: 'flex flex-col gap-[20px] bg-white  p-[20px] rounded-lg border',
})`  @media (min-width: 768px) {
    col-span-2
}`;

export const SaveButton = styled(DefaultButton).attrs({
    className: 'px-[20px]',
})``;

export const UploadText = styled.p.attrs({
    className: 'text-center',
})`
    font-size: 17px;

    & span {
        color: #c0d330;
        font-weight: 500;
    }
`;
