import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';
import { media } from 'libs/Theme/breakpoints';

export const body = styled.div`
    // border: 1px solid red;
`;

export const HeaderWrapper = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media ${media.xs} {
        flex-direction: column;
        align-items: flex-end;
    }
`;

export const SearchWrapper = styled.div`
    display: flex;
    @media ${media.sm} {
        justify-content: flex-end;
    }
`;

export const ButtonsWrapper = styled.div`
    display: flex;
    gap: 16px;

    @media ${media.xs} {
        flex-direction: column;
        width: 100%;
    }
    button {
        @media ${media.xs} {
            width: 100%;
        }
    }
`;

export const CreateSessionButton = styled.button`
    background-color: #c0d330;
    border: 1px solid #c0d330;
    color: white;
    cursor: pointer;
    align-self: flex-end;
    display: flex;
    gap: 4px;
    padding: 12px 24px;
    border-radius: 8px;
    align-items: center;
    &:hover {
        background-color: #a8bb2a;
    }
`;

export const CreateRegularSessionButton = styled.button`
    background-color: white;
    color: #c0d330;
    border: 1px solid #c0d330;
    cursor: pointer;
    align-self: flex-end;
    display: flex;
    gap: 4px;
    padding: 12px 24px;
    border-radius: 8px;
    align-items: center;
`;

export const UsersNumberTable = styled.p`
    color: #2020204d;
    font-size: 14px;
    font-weight: 400;
    display: flex;
    justify-content: center;
    padding: 5px;
    align-items: center;
    @media ${media.md} {
        font-size: 12px;
        justify-content: flex-start;
    }
`;
