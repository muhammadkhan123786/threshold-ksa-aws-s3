import styled, { css } from 'styled-components';

const activeStyles = css`
    background-color: #cdffcd;
    color: #007f00;
    &::before {
        background-color: #007f00;
    }
`;

const inactiveGrayStyles = css`
    background-color: #f2f0f9;
    color: #000;
    &::before {
        background-color: #000;
    }
`;

const inactiveRedStyles = css`
    background-color: #ffcdd6;
    color: #c00632;
    &::before {
        background-color: #c00632;
    }
`;

export const Container = styled.div`
    width: 8rem;
    display: flex;
    flex-direction: column;
`;

const beforeContentStyles = css<{ $dir: 'rtl' | 'ltr' }>`
    content: '';
    position: absolute;
    width: 10px;
    height: 10px;
    top: 50%;
    transform: translateY(-50%);
    border-radius: 50%;
    ${(props) => (props.$dir === 'rtl' ? 'right: 10px;' : 'left: 10px;')}
`;

export const AthleteProfileItem = styled.div<{
    $isActive: boolean;
    $inactiveColor: 'gray' | 'red';
}>`
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    padding: 3px 10px 3px 25px;
    border-radius: 18px;
    font-size: 12px;
    position: relative;

    ${(props) =>
        props.$isActive
            ? activeStyles
            : props.$inactiveColor === 'gray'
              ? inactiveGrayStyles
              : inactiveRedStyles};

    &::before {
        content: '';
        position: absolute;
        width: 8px;
        aspect-ratio: 1;
        left: 8px;
        top: 50%;
        transform: translateY(-50%);
        border-radius: 50%;
    }
`;

export const TeamStatus = styled.div`
    margin-top: 16px;
    font-weight: bold;
`;

export const MoreProfiles = styled.div`
    color: #007bff;
    font-weight: 600;
    margin-top: 4px;
    font-size: 0.85rem;
    position: relative;
    display: inline-block;
    transition: color 0.3s ease;
`;
