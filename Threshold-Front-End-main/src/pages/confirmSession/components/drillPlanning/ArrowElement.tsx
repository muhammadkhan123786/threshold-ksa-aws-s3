import React, { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import styled, { css } from 'styled-components';
import { FaArrowsAlt, FaSyncAlt, FaExpandArrowsAlt } from 'react-icons/fa';
import Rotatable from './Rotatable';
import { ItemTypes } from './ItemTypes';

interface ArrowContainerProps {
    left: number;
    top: number;
    mode: 'move' | 'rotate' | 'resize';
    selected: boolean;
}

const ArrowContainer = styled.div<ArrowContainerProps>`
    position: absolute;
    left: ${(props) => props.left}px;
    top: ${(props) => props.top}px;
    cursor: ${(props) =>
        props.mode === 'rotate' ? 'default' : props.mode === 'resize' ? 'nwse-resize' : 'move'};
    border: ${(props) => (props.selected ? '2px solid #007bff' : 'none')};
    border-radius: 5px;
    padding: 2px;
    box-shadow: ${(props) => (props.selected ? '0 0 10px rgba(0, 123, 255, 0.5)' : 'none')};
    transition:
        border 0.3s ease,
        box-shadow 0.3s ease;
    display: inline-block;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-around;
    margin-bottom: 10px;
    background-color: white;
    border-radius: 5px;
    padding: 5px;
    position: relative;
`;

const Button = styled.button<{ selected: boolean }>`
    border: none;
    background: none;
    cursor: pointer;
    padding: 5px;
    ${(props) =>
        props.selected &&
        css`
            background-color: #007bff;
            color: white;
            border-radius: 3px;
        `}
`;

const ArrowLine = styled.line`
    stroke: white;
    stroke-width: 2;
    stroke-dasharray: 5, 5;
`;

interface ArrowElementProps {
    left: number;
    top: number;
    width: number;
    height: number;
    id: number;
    onMove: (id: number, left: number, top: number) => void;
    onResize: (id: number, width: number, height: number) => void;
    onRotate: (id: number, rotate: number) => void;
    selectedId: number | null;
}

const ArrowElement: React.FC<ArrowElementProps> = ({
    left,
    top,
    width,
    height,
    id,
    onMove,
    onResize,
    onRotate,
    selectedId,
}) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [rotate, setRotate] = useState(0);
    const [mode, setMode] = useState<'move' | 'rotate' | 'resize'>('move');

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ARROW,
        item: { id, left, top },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop({
        accept: ItemTypes.ARROW,
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

    useEffect(() => {
        onRotate(id, rotate);
    }, [rotate, id, onRotate]);

    const handleRotate = (newRotate: number) => {
        setRotate(newRotate);
    };

    const handleModeChange = (newMode: 'move' | 'rotate' | 'resize') => {
        setMode(newMode);
    };

    const handleResizeStop = (e: React.SyntheticEvent, data: ResizeCallbackData) => {
        onResize(id, data.size.width, data.size.height);
    };

    return (
        <ArrowContainer
            ref={(node) => {
                elementRef.current = node;
                if (mode === 'move') drag(drop(node));
            }}
            left={left}
            top={top}
            mode={mode}
            selected={selectedId === id}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <ButtonContainer>
                <Button
                    type="button"
                    selected={mode === 'move'}
                    onClick={() => handleModeChange('move')}
                >
                    <FaArrowsAlt />
                </Button>
                <Button
                    type="button"
                    selected={mode === 'rotate'}
                    onClick={() => handleModeChange('rotate')}
                >
                    <FaSyncAlt />
                </Button>
                <Button
                    type="button"
                    selected={mode === 'resize'}
                    onClick={() => handleModeChange('resize')}
                >
                    <FaExpandArrowsAlt />
                </Button>
            </ButtonContainer>
            <Rotatable
                initialRotate={rotate}
                onRotate={handleRotate}
                isRotating={mode === 'rotate'}
            >
                {mode === 'resize' ? (
                    <ResizableBox
                        width={width}
                        height={height}
                        onResizeStop={handleResizeStop}
                        resizeHandles={['sw', 'se']} // Adding handles to start and end
                        minConstraints={[50, 50]}
                        maxConstraints={[300, 300]}
                    >
                        <svg width={width} height={height}>
                            <ArrowLine
                                x1="0"
                                y1="0"
                                x2={width - 10}
                                y2={height - 10}
                                markerEnd="url(#arrowhead)"
                            />
                        </svg>
                    </ResizableBox>
                ) : (
                    <svg width={width} height={height}>
                        <ArrowLine
                            x1="0"
                            y1="0"
                            x2={width - 10}
                            y2={height - 10}
                            markerEnd="url(#arrowhead)"
                        />
                    </svg>
                )}
            </Rotatable>
        </ArrowContainer>
    );
};

export default ArrowElement;
