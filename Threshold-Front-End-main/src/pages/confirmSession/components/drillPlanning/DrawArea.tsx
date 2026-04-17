import React, { useState, useCallback, useRef } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
import styled from 'styled-components';
import DraggableElement from './DraggableElement';
import PlayerElement from './PlayerElement';
import ArrowElement from './ArrowElement';
import FootballElement from './FootballElement';
import ConeElement from './ConeElement';
import SquareElement from './SquareElement';
import PyramidElement from './PyramidElement';
import GoalElement from './GoalElement';
import { ItemTypes } from './ItemTypes';

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 600px;
`;

interface DraggableItem {
    id: number;
    type:
        | 'element'
        | 'player'
        | 'arrow'
        | 'football'
        | 'ladder'
        | 'cone'
        | 'square'
        | 'pyramid'
        | 'goal';
    left: number;
    top: number;
    width?: number;
    height?: number;
    rotate?: number;
}

const DrawArea: React.FC = () => {
    const [elements, setElements] = useState<DraggableItem[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const moveElement = useCallback((id: number, left: number, top: number) => {
        setElements((prevElements) =>
            prevElements.map((el) => (el.id === id ? { ...el, left, top } : el)),
        );
    }, []);

    const resizeElement = useCallback((id: number, width: number, height: number) => {
        setElements((prevElements) =>
            prevElements.map((el) => (el.id === id ? { ...el, width, height } : el)),
        );
    }, []);

    const rotateElement = useCallback((id: number, rotate: number) => {
        setElements((prevElements) =>
            prevElements.map((el) => (el.id === id ? { ...el, rotate } : el)),
        );
    }, []);

    const [, drop] = useDrop<DraggableItem>({
        accept: [
            ItemTypes.ELEMENT,
            ItemTypes.PLAYER,
            ItemTypes.ARROW,
            ItemTypes.FOOTBALL,
            ItemTypes.LADDER,
            ItemTypes.CONE,
            ItemTypes.SQUARE,
            ItemTypes.PYRAMID,
            ItemTypes.GOAL,
        ],
        drop: (item: DraggableItem, monitor: DropTargetMonitor) => {
            const offset = monitor.getClientOffset();
            if (offset && containerRef.current) {
                const drawAreaBoundingRect = containerRef.current.getBoundingClientRect();
                const x = offset.x - drawAreaBoundingRect.left;
                const y = offset.y - drawAreaBoundingRect.top;

                if (item.id !== undefined) {
                    moveElement(item.id, x, y);
                } else {
                    const newId = elements.length
                        ? Math.max(...elements.map((el) => el.id)) + 1
                        : 0;
                    setElements((prevElements) => [
                        ...prevElements,
                        {
                            id: newId,
                            type: item.type,
                            left: x,
                            top: y,
                            width: 100,
                            height: 50,
                            rotate: 0,
                        },
                    ]);
                }
            }
        },
    });

    return (
        <Container
            ref={(node) => {
                containerRef.current = node;
                drop(node);
            }}
        >
            {elements.map((element) => {
                if (element.type === 'element') {
                    return (
                        <DraggableElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            onMove={moveElement}
                            onResize={resizeElement}
                        />
                    );
                } else if (element.type === 'player') {
                    return (
                        <PlayerElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            onMove={moveElement}
                        />
                    );
                } else if (element.type === 'arrow') {
                    return (
                        <ArrowElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            width={element.width!}
                            height={element.height!}
                            selectedId={selectedId}
                            onMove={moveElement}
                            onResize={resizeElement}
                            onRotate={rotateElement}
                        />
                    );
                } else if (element.type === 'cone') {
                    return (
                        <ConeElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            onMove={moveElement}
                        />
                    );
                } else if (element.type === 'square') {
                    return (
                        <SquareElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            onMove={moveElement}
                        />
                    );
                } else if (element.type === 'pyramid') {
                    return (
                        <PyramidElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            onMove={moveElement}
                        />
                    );
                } else if (element.type === 'goal') {
                    return (
                        <GoalElement
                            key={element.id}
                            id={element.id}
                            left={element.left}
                            top={element.top}
                            onMove={moveElement}
                        />
                    );
                }
                return null;
            })}
        </Container>
    );
};

export default DrawArea;
