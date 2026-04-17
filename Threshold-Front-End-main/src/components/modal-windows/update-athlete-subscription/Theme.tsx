import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const NameInputsWrapper = styled.div.attrs({
    className: 'flex justify-between gap-5 w-full',
})``;

export const AvatarWrapper = styled.div.attrs({
    className: 'grid w-full',
})`
    grid-template-columns: 80px auto;
    gap: 20px;
`;

export const Avatar = styled(DefaultImage).attrs({
    className: '',
})`
    width: 80px;
    aspect-ratio: 1 / 1;
    border-radius: 100%;
`;

export const UploadText = styled.p.attrs({
    className: 'text-center',
})`
    font-size: 17px;

    & span {
        color: #c0d330;
        font-weight: 500;
    }
`;
