import React, { useRef, useState } from 'react';
import { useDrag, useDrop, DropTargetMonitor } from 'react-dnd';
import { ResizableBox, ResizeCallbackData } from 'react-resizable';
import styled from 'styled-components';
import { ItemTypes } from './ItemTypes';
import 'react-resizable/css/styles.css';

const DraggableContainer = styled.div<{ left: number; top: number; mode: string }>`
    position: absolute;
    left: ${(props) => props.left}px;
    top: ${(props) => props.top}px;
    cursor: ${(props) => (props.mode === 'resize' ? 'nwse-resize' : 'move')};
`;

const ResizableCircle = styled(ResizableBox)<{ isActive: boolean }>`
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.5); // Transparent circle
    border: ${(props) => (props.isActive ? '2px solid orange' : '1px solid black')};
    position: relative;
`;

const ResizeHandle = styled.div<{ isActive: boolean }>`
    width: 10px;
    height: 10px;
    background-color: ${(props) => (props.isActive ? 'orange' : 'black')};
    position: absolute;
    right: -5px;
    bottom: -5px;
    cursor: nwse-resize;
`;

const ButtonContainer = styled.div`
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 5px;
`;

const Button = styled.button<{ active: boolean }>`
    border: none;
    background: ${(props) => (props.active ? 'orange' : 'black')};
    color: white;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    &:hover {
        background-color: ${(props) => (props.active ? '#e68a00' : '#333')};
    }
`;

interface DraggableElementProps {
    left: number;
    top: number;
    id: number;
    onMove: (id: number, left: number, top: number) => void;
    onResize: (id: number, width: number, height: number) => void;
}

const DraggableElement: React.FC<DraggableElementProps> = ({ left, top, id, onMove, onResize }) => {
    const elementRef = useRef<HTMLDivElement | null>(null);
    const [mode, setMode] = useState<'move' | 'resize'>('move');
    const [isActive, setIsActive] = useState(false);

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.ELEMENT,
        item: { id, left, top },
        canDrag: () => mode === 'move',
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [, drop] = useDrop({
        accept: ItemTypes.ELEMENT,
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

    const handleResizeStop = (e: any, data: ResizeCallbackData) => {
        onResize(id, data.size.width, data.size.height);
    };

    const toggleResizeMode = () => {
        setMode((prevMode) => (prevMode === 'move' ? 'resize' : 'move'));
        setIsActive((prevIsActive) => !prevIsActive);
    };

    return (
        <DraggableContainer
            ref={(node) => {
                elementRef.current = node;
                drag(drop(node));
            }}
            left={left}
            top={top}
            mode={mode}
            style={{ opacity: isDragging ? 0.5 : 1 }}
        >
            <ButtonContainer>
                <Button type="button" active={mode === 'resize'} onClick={toggleResizeMode}>
                    Resize
                </Button>
            </ButtonContainer>
            <ResizableCircle
                width={100}
                height={100}
                minConstraints={[50, 50]}
                maxConstraints={[200, 200]}
                onResizeStop={handleResizeStop}
                isActive={isActive}
                style={{ pointerEvents: mode === 'resize' ? 'auto' : 'none' }}
            >
                <div style={{ width: '100%', height: '100%' }} />
                {mode === 'resize' && <ResizeHandle isActive={isActive} />}
            </ResizableCircle>
        </DraggableContainer>
    );
};

export default DraggableElement;
