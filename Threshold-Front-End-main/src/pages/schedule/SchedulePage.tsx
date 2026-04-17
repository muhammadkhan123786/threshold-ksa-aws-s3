import styled from 'styled-components';
import { Calendar } from './components';
const Box = styled.div`
    color: #fff;
    display: flex;
    background: #00000090;
`;

export const SchedulePage = () => {
    return (
        <Box>
            <Calendar />
        </Box>
    );
};
