import styled from 'styled-components';

export const Body = styled.div.attrs({
    className: 'flex',
})`
    justify-content: center;
    align-items: center;
    height: fit-content;
    overflow: hidden;
`;

export const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
`;
