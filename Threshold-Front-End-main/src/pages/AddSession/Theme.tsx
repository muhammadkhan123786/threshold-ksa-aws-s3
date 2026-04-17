import { media } from 'libs/Theme/breakpoints';
import styled from 'styled-components';

export const NavigationWrapper = styled.div`
    font-family: 'IBM Plex Sans Arabic', 'sans-serif';
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    align-items: center;
    width: 96%;
    margin: 20px;
`;

export const NavigationButton = styled.div`
    font-weight: 600;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: #202020d9;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #e6e6e6;
    }

    img {
        margin-left: 8px;
        width: 16px;
        height: 16px;
    }
`;
export const CreateSessionTitle = styled.p`
    font-weight: 600;
    opacity: 50%;
    color: #202020;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border-radius: 8px;
    cursor: pointer;
`;

export const Body = styled.form.attrs({ className: 'flex flex-col' })`
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    width: 96%;
    margin: 0px 20px;
    transition: all 0.3s ease;
    &:hover {
        box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
    }
`;

export const Input = styled.input`
    padding: 10px;
    border: 2px solid #ddd;
    border-radius: 4px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    background-color: #f9f9f9;

    &:focus {
        border-color: #c0d330;
    }

    &::placeholder {
        color: #bbb;
    }
`;

export const FlexWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;
    transition: all 0.3s ease;

    @media ${media.xs} {
        display: block;
    }
`;

export const InputsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;

export const FullWidthInputsWrapper = styled(InputsWrapper)`
    width: 100%;
    grid-column: span 2;
`;

export const TextArea = styled.textarea`
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 5px;
    font-size: 14px;
    resize: vertical;
    min-height: 80px;
    border-radius: 8px;
`;

export const Select = styled.select`
    padding: 10px;
    border: 1px solid #ddd;
    outline: none;
    width: 100%;
    background-color: white;
    font-size: 14px;
    border-radius: 8px;
    option {
        font-size: 14px;
        padding: 10px;
    }
`;

export const InputsWrapperRangeTime = styled.div`
    height: fit-content;
    display: flex;
    justify-content: space-around;
    align-items: center;
    margin: auto;
    grid-template-columns: repeat(2, 1fr);
    border: 1px solid #ddd;
    outline: none;
    padding: 8px;
    border-radius: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;

export const DatePickerWrapper = styled.div`
    position: relative;
    width: 100%;
    .react-datepicker__input-container {
        display: flex;
        align-items: center;
        width: 100%;
    }
    img {
        position: absolute;
        right: 10px;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
`;

export const PeriodWrapper = styled.div`
    display: flex;
    gap: 16px;
    @media ${media.sm} {
        flex-direction: column;
    }
`;
export const EvenWrapper = styled.div`
    display: flex;
    gap: 24px;
    @media ${media.sm} {
        flex-direction: column;
        gap: 0px;
    }
`;
