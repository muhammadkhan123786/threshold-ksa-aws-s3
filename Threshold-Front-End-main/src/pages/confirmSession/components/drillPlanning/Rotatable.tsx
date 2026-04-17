import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';

const RotatableContainer = styled.div<{ rotate: number }>`
    transform: rotate(${(props) => props.rotate}deg);
    transform-origin: center;
`;

interface RotatableProps {
    children: React.ReactNode;
    initialRotate: number;
    onRotate: (rotate: number) => void;
    isRotating: boolean;
}

const Rotatable: React.FC<RotatableProps> = ({ children, initialRotate, onRotate, isRotating }) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [rotating, setRotating] = useState(false);
    const [rotate, setRotate] = useState(initialRotate);

    useEffect(() => {
        if (!isRotating) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (rotating && containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                const angle =
                    Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
                setRotate(angle);
                onRotate(angle);
            }
        };

        const handleMouseUp = () => {
            setRotating(false);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [rotating, onRotate, isRotating]);

    return (
        <RotatableContainer
            ref={containerRef}
            rotate={rotate}
            onMouseDown={() => isRotating && setRotating(true)}
        >
            {children}
        </RotatableContainer>
    );
};

export default Rotatable;
