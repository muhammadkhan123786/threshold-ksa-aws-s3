import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.div.attrs({ className: 'flex flex-col justify-start items-center' })`
    height: 100%;
    padding: 30px;
    gap: 50px;
`;

export const AvatarSection = styled.div.attrs({
    className: 'flex w-full',
})`
    align-items: center;
    flex-wrap: wrap;
    @media (max-width: 768px) {
        width: inherit !important;
    }
`;

export const Avatar = styled(DefaultImage)`
    width: 120px;
    aspect-ratio: 1;
    border-radius: 100%;
`;

export const Name = styled(DefaultText)`
    text-align: start;
    font-size: 30px;
    font-weight: bold;
    margin-inline-start: 20px;
    margin-bottom: 20px;

    margin-inline-end: auto;
`;

export const SessionTitleSection = styled.div.attrs({
    className: 'flex flex-wrap',
})``;

export const SessionTitle = styled.div.attrs({
    className: 'me-[30px] text-[18px] uppercase font-bold flex flex-wrap',
})``;

export const Button = styled(DefaultButton)`
    padding: 10px;
`;

export const SessionPlaning = {
    Body: styled.div`
        display: ${({ hidden }) => (hidden ? 'none' : 'flex')};
        display: flex;
        flex-direction: column;
        gap: 24px;
        padding: 32px;
        width: 100%;
        border: 2px solid #e0e2e7;
        border-radius: 8px;
        background-color: #fff;
    `,
    Header: styled.div`
        font-size: 24px;
        font-weight: bold;
        color: #1a1c21;
        margin-bottom: 16px;
    `,
    Section: styled.div`
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 16px;
    `,
    SectionTitle: styled.div`
        font-size: 16px;
        font-weight: bold;
        color: #1a1c21;
        margin-bottom: 4px;
    `,
    SessionTitle: styled.div`
        font-size: 18px;
        font-weight: bold;
        color: #1a1c21;
    `,
    Description: styled.p`
        font-size: 14px;
        color: #5a5c69;
        line-height: 1.5;
        margin-bottom: 16px;
    `,
    DetailRow: styled.div`
        display: flex;
        padding: 16px;
        border: 1px solid #e0e2e7;
        border-radius: 8px;
        background-color: #f9f9fb;
    `,
    DetailItem: styled.div`
        display: flex;
        flex-direction: column;
        font-size: 14px;
        color: #1a1c21;
        flex: 1;

        & > .label {
            font-weight: bold;
            color: #5a5c69;
            margin-bottom: 4px;
        }

        & > .value {
            color: #1a1c21;
        }
    `,
    EditButton: styled.button`
        align-self: flex-end;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
        color: #fff;
        background-color: #c0d330;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.3s;

        &:hover {
            background-color: #a9bb29;
        }
    `,
};
