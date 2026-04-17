import styled from 'styled-components';
import { Button as DefaultButton } from 'components';

export const Button = styled(DefaultButton)<{ $isTable?: boolean }>`
    font-size: 14px !important;
    width: 100%;
    background-color: transparent;
    color: #000;
    border: 1px solid #c0d330;
    padding: 10px !important;
    margin-inline-start: 30px;
    margin-top: -90px !important;
    &:hover {
        background-color: #c0d330;
        color: #fff;
    }
    @media (max-width: 767px) {
        margin-top: 0px !important;
        width: 100% !important;
    }
`;

export const CardBody = styled.div`
    @media (max-width: 767px) {
        align-self: center;
    }
`;
export const CardTitle = styled.div`
    @media (max-width: 767px) {
        font-size: 1rem !important;
    }
`;
export const CardTitleBody = styled.div`
    @media (max-width: 767px) {
        align-items: baseline;
        flex-direction: row !important;
        gap: 10px !important;
    }
`;

export const CardValue = styled.div`
    @media (max-width: 767px) {
        font-size: 1rem !important;
    }
`;
export const CardCellBody = styled.div` @media (max-width: 767px) {
    margin-block-end !important;
}`;
