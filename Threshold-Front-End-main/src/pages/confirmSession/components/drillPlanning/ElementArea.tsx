import React from 'react';
import { useDrag } from 'react-dnd';
import styled from 'styled-components';
import { ItemTypes } from './ItemTypes';
import { FaUserAlt, FaArrowRight, FaSquare, FaCircle } from 'react-icons/fa';
import { FormRow } from 'components/modal-windows/FormRow';
import { SingleSelect } from 'components/multi-selection/SingleSelect';
import { useLocales } from 'hooks/locales';
import { GiTrafficCone, GiSoccerBall, GiBallPyramid } from 'react-icons/gi';
import { FiSquare } from 'react-icons/fi';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 20px;
    width: 50%;
    gap: 20px;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const ElementsContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    > div:not(:last-child) {
        border-inline-end: 2px solid #e0e2e7;
    }
`;

const DraggableItem = styled.div<{ isDragging: boolean }>`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    padding-inline-end: 10px;
    background-color: white;
    opacity: ${(props) => (props.isDragging ? 0.5 : 1)};
    cursor: move;
`;

const SubTitle = styled.div`
    font-size: 14px;
    color: #555;
`;

const Title = styled.div`
    width: 100%;
    font-size: 18px;
    font-weight: 500;
`;
const Header = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const HeaderContent = styled.div`
    display: flex;
    justify-content: center;
    align-items: end;

    > img {
        border-inline-end: 1px solid #ccc;
        padding-inline-end: 20px;
    }
    > div {
        padding-inline-start: 20px;
    }
`;

const ElementArea: React.FC<{ setBackgroundType: any }> = ({ setBackgroundType }) => {
    const { trans } = useLocales();

    const createDragHook = (type: string) =>
        useDrag(() => ({
            type,
            item: { type },
            collect: (monitor) => ({
                isDragging: !!monitor.isDragging(),
            }),
        }));

    const [{ isDragging: isDraggingElement }, dragElement] = createDragHook(ItemTypes.ELEMENT);
    const [{ isDragging: isDraggingPlayer }, dragPlayer] = createDragHook(ItemTypes.PLAYER);
    const [{ isDragging: isDraggingArrow }, dragArrow] = createDragHook(ItemTypes.ARROW);
    const [{ isDragging: isDraggingFootball }, dragFootball] = createDragHook(ItemTypes.FOOTBALL);
    const [{ isDragging: isDraggingCone }, dragCone] = createDragHook(ItemTypes.CONE);
    const [{ isDragging: isDraggingSquare }, dragSquare] = createDragHook(ItemTypes.SQUARE);
    const [{ isDragging: isDraggingPyramid }, dragPyramid] = createDragHook(ItemTypes.PYRAMID);
    const [{ isDragging: isDraggingGoal }, dragGoal] = createDragHook(ItemTypes.GOAL);

    return (
        <Container>
            <Header>
                <Title>
                    {trans('confirm-session.drillDetails', { defaultValue: 'Drill details' })}
                </Title>
                <HeaderContent className="flex flex-initial w-full">
                    <img src="/assets/icons/football-back-icon.svg" alt="football" />
                    <div className="w-full">
                        {trans('confirm-session.type', { defaultValue: 'Type' })}
                        <SingleSelect
                            name="type"
                            options={[
                                { label: 'Full Field', value: 'fullField' },
                                { label: 'Half Field', value: 'halfField' },
                            ]}
                            transSuffix="form.drillDetails."
                            onChange={setBackgroundType}
                        />
                    </div>
                </HeaderContent>
            </Header>

            <SubTitle>{trans('confirm-session.elemnts', { defaultValue: 'Elements' })}</SubTitle>
            <ElementsContainer>
                <DraggableItem ref={dragPlayer} isDragging={isDraggingPlayer}>
                    <FaUserAlt size={24} />
                </DraggableItem>
                <DraggableItem ref={dragArrow} isDragging={isDraggingArrow}>
                    <FaArrowRight size={24} />
                </DraggableItem>

                <DraggableItem ref={dragElement} isDragging={isDraggingElement}>
                    <FaCircle size={24} />
                </DraggableItem>
                <DraggableItem ref={dragCone} isDragging={isDraggingCone}>
                    <GiTrafficCone size={24} />
                </DraggableItem>
                <DraggableItem ref={dragSquare} isDragging={isDraggingSquare}>
                    <FiSquare size={24} />
                </DraggableItem>
                <DraggableItem ref={dragPyramid} isDragging={isDraggingPyramid}>
                    <GiBallPyramid size={24} />
                </DraggableItem>
                <DraggableItem ref={dragGoal} isDragging={isDraggingGoal}>
                    <GiSoccerBall size={24} />
                </DraggableItem>
            </ElementsContainer>
        </Container>
    );
};

export default ElementArea;
