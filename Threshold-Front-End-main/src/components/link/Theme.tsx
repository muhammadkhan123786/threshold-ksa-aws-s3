import styled from 'styled-components';

export const Link = styled.a`
    transition: 0.3s ease;
    font-weight: bold;
    text-underline-offset: 2px;

    &:hover {
        opacity: 0.7;
        text-decoration: underline;
    }
`;
