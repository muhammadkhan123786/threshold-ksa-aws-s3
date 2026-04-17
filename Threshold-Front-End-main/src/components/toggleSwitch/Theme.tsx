import React from 'react';
import styled from 'styled-components';

// Styled components
export const ToggleSwitchContainer = styled.div`
    width: 80px;
    height: auto;
    top: 50%;
    left: 50%;
    display: flex;
    align-items: center;
    gap: 8px;
`;

export const ToggleSwitchInput = styled.input`
    position: relative;
    width: 75%;
    height: 20px;
    background: #efefef;
    -webkit-appearance: none;
    outline: none;
    border-radius: 30px;
    box-shadow: inset 0px 0px 4px 1px rgba(0, 0, 0, 0.08);
    transition: 0.5s;

    &:checked {
        background: #c0d330;
    }

    &:before {
        content: '';
        position: absolute;
        width: 20px;
        height: 20px;
        left: -2px;
        background: #fff;
        box-shadow: 0px 1px 6px 1px gainsboro;
        border-radius: 50%;
        top: 0px;
        transform: scale(1.1);
        transition: 0.5s;
    }

    &:checked:before {
        left: 40px;
    }
`;

export const ToggleSwitchLabel = styled.span`
    font-size: 14px;
    color: #333;
`;
