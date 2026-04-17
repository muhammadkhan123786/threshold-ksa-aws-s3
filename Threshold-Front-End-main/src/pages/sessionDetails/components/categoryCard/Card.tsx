import React from 'react';
import * as Theme from './Theme';

interface CardProps {
    isActive: boolean;

    onClick: (data: any) => void;

    children: any;
}

export const Card: React.FC<CardProps> = ({ isActive, children, onClick }) => {
    const HandleActiveTabData = () => {
        onClick(children);
    };
    return (
        <Theme.Card isActive={isActive} onClick={HandleActiveTabData}>
            <Theme.PhaseSpan>{children?.phase}</Theme.PhaseSpan>
            <Theme.ActivitySpan>{children?.activity}</Theme.ActivitySpan>
            <Theme.DistanceSpan>
                <img src="/assets/icons/target-icon.svg" height={16} width={16} alt="club logo" />
                {children?.distance}
            </Theme.DistanceSpan>
            <Theme.HrLine />
            <Theme.DistanceDatabase>
                {children?.segments?.map((ele: any, index: number) => (
                    <Theme.DataWrapper key={index}>
                        <p>{ele.distance}</p>
                        <p>{ele.value}</p>
                    </Theme.DataWrapper>
                ))}
            </Theme.DistanceDatabase>
        </Theme.Card>
    );
};
