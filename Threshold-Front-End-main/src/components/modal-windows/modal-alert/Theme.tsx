import styled from 'styled-components';
import { Text as DefaultText, Image as DefaultImage } from 'components';

export const AlertTitle = styled(DefaultText)`
    font-size: 20px;
    font-weight: 600;
    text-align: center;
`;

export const AlertSubtitle = styled(DefaultText)`
    text-align: center;
`;

export const AlertImage = styled(DefaultImage)`
    height: 100%;
    margin: auto;
    aspect-ratio: 1 / 1;
`;
