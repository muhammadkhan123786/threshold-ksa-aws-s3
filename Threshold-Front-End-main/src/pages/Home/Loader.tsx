import RingLoader from 'react-spinners/RingLoader';
import styled from 'styled-components';

const Body = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: #00000090;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
`;
export const Loader = () => {
    return (
        <Body>
            ss
            <div>
                <RingLoader size={70} color="#fff" />
            </div>
        </Body>
    );
};
