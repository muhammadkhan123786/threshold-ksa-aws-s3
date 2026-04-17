import styled from 'styled-components';
import DrillItem from './DrillItem';
import useFetchSessionAndPlanningSessions from 'services/hooks/sessions/useFetchSessionAndPlanningSessions';
import router from 'routers/router';
import { Loader } from 'components';

const DrillListContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    width: 100%;

    @media (max-width: 768px) {
        gap: 15px;
    }
`;

const DrillList = () => {
    const {
        params: { id },
    } = router.getState();

    const { data, isLoading } = useFetchSessionAndPlanningSessions(id);

    const planningSessions = (data as any)?.payload?.[0]?.planningSessions;
    if (isLoading) {
        return <Loader />;
    }

    return (
        <DrillListContainer>
            {planningSessions?.map((drill: any) => <DrillItem key={drill.id} drill={drill} />)}
        </DrillListContainer>
    );
};

export default DrillList;
