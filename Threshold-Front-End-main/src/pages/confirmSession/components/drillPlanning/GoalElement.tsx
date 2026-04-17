import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import styled from 'styled-components';
import { ItemTypes } from './ItemTypes';
import { GiSoccerBall } from 'react-icons/gi';

const GoalIcon = styled(GiSoccerBall)`
    color: white;
    font-size: 2rem;
    cursor: move;
`;

interface GoalElementProps {
    left: number;
    top: number;
    id: number;
    onMove: (id: number, left: number, top: number) => void;
}

const GoalElement: React.FC<GoalElementProps> = ({ left, top, id, onMove }) => {
    const elementRef = useRef<HTMLDivElement | null>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.GOAL,
        item: { id, left, top },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop({
        accept: ItemTypes.GOAL,
        drop: (item: { id: number; left: number; top: number }, monitor: DropTargetMonitor) => {
            const offset = monitor.getClientOffset();
            if (offset && elementRef.current) {
                const dropTargetBoundingRect = elementRef.current.getBoundingClientRect();
                const x = offset.x - dropTargetBoundingRect.left;
                const y = offset.y - dropTargetBoundingRect.top;
                onMove(item.id, x, y);
            }
        },
    });

    return (
        <div
            ref={(node) => {
                elementRef.current = node;
                drag(drop(node));
            }}
            style={{
                position: 'absolute',
                left: `${left}px`,
                top: `${top}px`,
                opacity: isDragging ? 0.5 : 1,
                width: '50px',
                height: '50px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <GoalIcon />
        </div>
    );
};

export default GoalElement;
