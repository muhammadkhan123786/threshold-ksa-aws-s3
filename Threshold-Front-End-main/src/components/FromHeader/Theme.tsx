import styled from 'styled-components';
import { Image as DefaultImage, Text as DefaultText } from 'components';

export const FormTitle = styled(DefaultText)`
    font-weight: 600;
    font-size: 24px;
`;

export const FormHeaderWrapper = styled.div<{ marginTop?: string; marginBottom?: string }>`
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: ${({ marginBottom }) => marginBottom || '40px'};
    margin-top: ${({ marginTop }) => marginTop || '136px'};
`;
export const Logo = styled(DefaultImage)`
    width: 47px;
    height: 16px;
`;
