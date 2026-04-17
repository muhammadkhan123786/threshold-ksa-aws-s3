import { useSelector } from 'react-redux';
import styled from 'styled-components';
import ClipLoader from 'react-spinners/ClipLoader';

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

export const LockLoader = () => {
    const { loader } = useSelector<any>((state) => state?.lockLoader) as any;
    if (!loader) return null;
    return (
        <Box>
            <ClipLoader color="#fff" size={70} />
        </Box>
    );
};
