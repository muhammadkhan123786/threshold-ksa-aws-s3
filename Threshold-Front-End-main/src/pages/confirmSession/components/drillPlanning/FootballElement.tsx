import React, { useRef } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import styled from 'styled-components';
import { ItemTypes } from './ItemTypes';

const FootballIcon = styled.img`
    width: 2rem;
    height: 2rem;
    cursor: move;
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%);
`;

interface FootballElementProps {
    left: number;
    top: number;
    id: number;
    onMove: (id: number, left: number, top: number) => void;
}

const FootballElement: React.FC<FootballElementProps> = ({ left, top, id, onMove }) => {
    const elementRef = useRef<HTMLDivElement | null>(null);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.FOOTBALL,
        item: { id, left, top },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop({
        accept: ItemTypes.FOOTBALL,
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
            <FootballIcon src="/assets/icons/football-icon.svg" alt="Football" />
        </div>
    );
};

export default FootballElement;
