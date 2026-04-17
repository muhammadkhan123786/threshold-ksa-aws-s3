import styled, { css } from 'styled-components';
import { Image as DefaultImage } from 'components';

export const Body = styled.div`
    width: 100%;
    position: relative;
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

export const AvatarWrapper = styled.div.attrs<{ $isAvatar: boolean }>({
    className: 'grid w-full',
})`
    ${(props) => {
        return props.$isAvatar
            ? css`
                  grid-template-columns: 80px auto;
                  gap: 20px;
                  @media (max-width: 768px) {
                      display: flex;
                      flex-direction: column;
                      align-items: center;
                  }
              `
            : css``;
    }}
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
