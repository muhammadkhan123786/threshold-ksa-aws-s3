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
    border: 1px dashed #c0d330;
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
export const FileName = styled.span`
    display: block;
    margin-top: 10px;
    font-size: 14px;
    color: #333;
    word-break: break-word; // Ensure long file names are handled properly
`;

export const ProgressBarWrapper = styled.div.attrs({
    className: 'w-full flex flex-col gap-2',
})`
    margin-top: 10px;
`;

interface ProgressBarProps {
    onProgress: number;
}

export const ProgressBar = styled.div.attrs({
    className: 'w-full h-2 bg-gray-200 rounded-full overflow-hidden',
})<ProgressBarProps>`
    position: relative;

    &::after {
        content: '';
        display: block;
        height: 100%;
        background-color: #d2e180; /* Green progress color */
        width: ${(props) => props.onProgress || 0}%;
        transition: width 0.3s ease-in-out;
    }
`;

export const TimeRemaining = styled.span.attrs({
    className: 'text-xs text-gray-500 text-center',
})`
    font-size: 12px;
    color: #7d7d7d;
`;

export const percentageWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`;
