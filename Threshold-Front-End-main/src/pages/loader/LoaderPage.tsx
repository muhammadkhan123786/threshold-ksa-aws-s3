import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';
import { ThreeDots } from 'react-loader-spinner';

const Box = styled.div`
    color: #fff;
    display: flex;
    background: #00000090;
    justify-content: center;
    align-items: center;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 100000;
`;

export const LoaderPage = () => {
    return (
        <Box>
            <ThreeDots color="#000" height={50} width={50} />
        </Box>
    );
};
