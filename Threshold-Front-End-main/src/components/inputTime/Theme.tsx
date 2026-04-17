import styled from 'styled-components';

export const Body = styled.div`
    width: 100%;
    position: relative;

    & .react-datepicker {
        border: 1px solid #ccc;
        border-radius: 15px;
    }

    & .react-datepicker-wrapper {
        width: 100%;
    }

    & .react-datepicker__header {
        background-color: #f7f7f7;
        border-radius: 15px 15px 0 0;
        padding-top: 30px;
    }

    & .react-datepicker__navigation {
        top: 30px;
    }

    & .react-datepicker__header__dropdown {
        height: 50px;
        padding: 30px 0px;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    & select {
        padding: 7px 15px;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    }

    & option {
        padding: 5px;
        margin: 5px;
    }

    & input {
        width: 100%;
        height: 40px;
        transition: border-color 0.3s;
        padding: 0px 15px 0px 50px;
        margin: 0;
        border: 1px solid #ccc;
        border-radius: 8px;
        font-size: 16px;
    }
`;

export const IconImage = styled.img`
    position: absolute;
    width: 20px;
    height: auto;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 2;
    opacity: 0.7;
`;
