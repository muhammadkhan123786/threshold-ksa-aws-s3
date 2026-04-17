import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const StatusContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: fit-content;
    height: fit-content;
    gap: 20px;
    margin: 20px;
    padding: 16px;
    background-color: #f9f9fc;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

    @media ${media.sm} {
        flex-direction: column;
        min-width: 100%;
    }
`;

export const IconContainer = styled.div<{ isRTL: boolean }>`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 8px;
    position: relative;

    /* Vertical line between items for larger screens */
    & + & {
        border-left: 2px solid #ddd; /* Vertical line */
        padding-left: 20px;
        margin-left: 20px;

        ${({ isRTL }) =>
            isRTL &&
            `
          border-left: none; /* Remove left border */
          border-right: 2px solid #ddd; /* Add right border */
          padding-left: 0; 
          margin-left: 0;
          padding-right: 20px; 
          margin-right: 20px; 
        `}
    }

    /* Horizontal line under every box for smaller screens */
    @media ${media.sm} {
        flex-direction: column;
        min-width: 100%;

        /* Add a border-bottom to every IconContainer */
        border-bottom: 2px solid #ddd;
        padding-bottom: 20px; /* Add spacing below the line */
        margin-bottom: 20px; /* Add spacing below the line */

        /* Remove vertical lines between containers */
        & + & {
            border-left: none;
            border-right: none;
            padding-left: 0;
            margin-left: 0;
            padding-right: 0;
            margin-right: 0;
        }

        /* Remove the border-bottom from the last container */
        &:last-child {
            border-bottom: none;
            padding-bottom: 0;
            margin-bottom: 0;
        }
    }
`;

export const IconImage = styled.img`
    width: 50px;
    height: 50px;
    object-fit: contain;
    transition: transform 0.3s;

    &:hover {
        transform: scale(1.1);
    }
`;

export const Text = styled.p`
    font-size: 16px;
    font-weight: 500;
    color: #777980;
    text-align: center;
`;

export const NumberText = styled.p<{ status: string }>`
    font-size: 24px;
    font-weight: 600;
    color: ${(props) =>
        props.status === 'needsCloth'
            ? '#EB5353'
            : props.status === 'notDelivered'
              ? '#FFC000'
              : '#039855'};
    text-align: center;
`;
