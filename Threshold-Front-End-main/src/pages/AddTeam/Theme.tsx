import styled from 'styled-components';
import { Button as DefaultButton, Text as DefaultText, Image as DefaultImage } from 'components';

export const Body = styled.form.attrs({ className: 'flex flex-col justify-start items-start' })`
    padding: 30px;
`;

export const TableTitle = styled(DefaultText)`
    text-transform: capitalize;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
`;

export const WarningMessage = styled(DefaultText).attrs({ className: 'mb-[20px]' })`
    font-size: 18px;
    color: #ff0000;
`;
