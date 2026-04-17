import { useState, useEffect, forwardRef } from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import ElementArea from './ElementArea';
import DrawArea from './DrawArea';
import styled from 'styled-components';
import html2canvas from 'html2canvas';

interface ContainerProps {
    backgroundImage: string;
}

const DrawContainer = styled.div<ContainerProps>`
    position: relative;
    width: 50%;
    height: fit-content;
    background: url(${(props) => props.backgroundImage}) no-repeat center center;
    background-size: cover;
    overflow: hidden;
    border-radius: 25px;
    margin-block: 10px;
    max-width: 500px;
    margin-inline-end: auto;
    @media (max-width: 767px) {
        width: 100%;
    }
`;

const FlexContainer = styled.div`
    display: flex;
    @media (max-width: 767px) {
        flex-direction: column;
    }
`;

interface DrillPlanningToolProps {
    methods: any;
}

const DrillPlanningTool = forwardRef<HTMLDivElement, DrillPlanningToolProps>(({ methods }, ref) => {
    const [backgroundType, setBackgroundType] = useState({
        label: 'Full Field',
        value: 'fullField',
    });

    const getBackgroundImage = () => {
        switch (backgroundType.value) {
            case 'fullField':
                return '/assets/icons/football-background.svg';
            case 'halfField':
                return '/assets/icons/football-half-background.svg';
            default:
                return '/assets/icons/football-background.svg';
        }
    };

    useEffect(() => {
        if (ref && 'current' in ref && ref.current) {
            html2canvas(ref.current).then((canvas) => {
                const base64Image = canvas.toDataURL('image/png');
                methods.setValue('drillImage', base64Image);
            });
        }
    }, [backgroundType, ref, methods]);

    return (
        <DndProvider backend={HTML5Backend}>
            <FlexContainer>
                <DrawContainer backgroundImage={getBackgroundImage()} ref={ref}>
                    <DrawArea />
                </DrawContainer>
                <ElementArea setBackgroundType={setBackgroundType} />
            </FlexContainer>
            <input type="hidden" {...methods.register('drawAreaImage')} />
        </DndProvider>
    );
});

export default DrillPlanningTool;
