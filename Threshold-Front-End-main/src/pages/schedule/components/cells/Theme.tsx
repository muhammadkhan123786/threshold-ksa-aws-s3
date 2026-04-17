import { PlayingSessionStatus } from 'libs/enums';
import styled from 'styled-components';

export const StyledCell = styled.div`
    width: 100%;
    height: 72px;
    background-color: white;
    border-inline-end: 1px solid #ddd;
    border-bottom: 1px solid #ddd;

    display: flex;
    align-items: center;
    justify-content: center;
    color: #000;
`;

export const StyledHeaderCell = styled.div`
    width: 100%;
    height: 60px;
    background-color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    border-bottom: 1px solid #ddd;
    color: #000;
`;

export const LogoImage = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 100%;
    margin-inline-end: 10px;
`;

export const NoteContainer = styled.div`
    background-color: yellow;
    padding: 10px;
    margin-bottom: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

export const SessionCardContainer = styled.div<{ status: PlayingSessionStatus }>`
    width: 100%;
    cursor: pointer;
    background-color: #fff;
    box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    padding: 10px;
    background-color: #322b3d50;
    border-inline-start: 3px solid
        ${({ status }) => {
            switch (status) {
                case PlayingSessionStatus.NOT_STARTED:
                    return '#6e0ee9';
                case PlayingSessionStatus.DONE:
                    return '#00b894';
                default:
                    return '#555';
            }
        }};
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;
`;

export const StatusText = styled.div<{ status: PlayingSessionStatus }>`
    font-weight: bold;
    color: ${({ status }) => {
        switch (status) {
            case PlayingSessionStatus.NOT_STARTED:
                return '#6e0ee9';
            case PlayingSessionStatus.DONE:
                return '#00b894';
            default:
                return '#555';
        }
    }};
    margin-bottom: auto;
`;

export const DetailsContainer = styled.div`
    display: flex;
    align-items: center;
    margin-top: auto;
    background-color: rgba(253, 242, 242, 0.4);
    border-radius: 10px;
    padding: 0 5px;
`;

export const Dot = styled.div<{ status: PlayingSessionStatus }>`
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${({ status }) => {
        switch (status) {
            case PlayingSessionStatus.NOT_STARTED:
                return '#FF3A69';
            case PlayingSessionStatus.DONE:
                return '#CDFFCD';
            default:
                return '#333';
        }
    }};
    margin-inline-end: 5px;
`;

export const DetailsText = styled.div<{ status: PlayingSessionStatus }>`
    font-size: 14px;
    display: flex;
    align-items: center;
    color: ${({ status }) => {
        switch (status) {
            case PlayingSessionStatus.NOT_STARTED:
                return '#FF3A69';
            case PlayingSessionStatus.DONE:
                return '#CDFFCD';
            default:
                return '#333';
        }
    }};
`;
