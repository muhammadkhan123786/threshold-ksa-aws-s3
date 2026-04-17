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
    border: 1px solid #20202099;
    opacity: 50%;
    cursor: pointer;
    font-size: 14px;
    color: #202020d9;
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
    padding: 10px 30px;
    background-color: white;
    width: 100%;
    margin: auto;
`;

export const Input = styled.input`
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    background-color: white;

    &::placeholder {
        color: #bbb;
    }
`;

export const GridWrapper = styled.div`
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    width: 100%;
    transition: all 0.3s ease;
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
export const LineHR = styled.hr`
    color: black;
    font-size: 2px;
    margin: 20px 0px;
`;
export const InputsMultiWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    width: 100%;
    transition: all 0.3s ease;
`;
export const Error = styled.span`
    color: #d9534f; /* A soft red for error indication */
    font-size: 12px;
    margin-top: 4px;
    display: block;
    font-weight: 500;
    transition: all 0.3s ease;

    &::after {
        content: '⚠️';
    }
`;
