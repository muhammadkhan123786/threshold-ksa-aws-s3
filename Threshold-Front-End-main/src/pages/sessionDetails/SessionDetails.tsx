import { useState } from 'react';
import * as Theme from './Theme';
import Header from './components/Header/Header';
import { Card } from './components/categoryCard/Card';
import { TabCardComponant } from './components/tabCard/TabCard';

export const SessionDetails = () => {
    const [activeCard, setActiveCard] = useState<any>();
    const [activeData, setActiveData] = useState<any>([]);

    const cardData: any = [
        {
            phase: '1st Phase',
            phaseTitle: 'Phase Title (1/4)',
            activity: 'Freestyle1',
            distance: '100 meters',
            segments: [
                { distance: '50 m', value: '0/16' },
                { distance: '100 m', value: '0/16' },
                { distance: '150 m', value: '0/16' },
                { distance: '200 m', value: '0/16' },
            ],
            columns: [
                { name: 'Player' },
                { name: '100 m' },
                { name: '200 m' },
                { name: '250 m' },
                { name: '300 m' },
                { name: '400 m' },
            ],
            playersData: [
                { name: 'Nader Shakshak', position: 'aHead' },
                { name: 'Shakshak', position: 'asHead' },
                { name: 'Nader', position: 'adHead' },
                { name: 'Shak', position: 'afHead' },
            ],
        },
        {
            phaseTitle: 'Phase Title (4/4)',
            phase: '2st Phase',
            activity: 'Freestyle2',
            distance: '100 meters',
            segments: [
                { distance: '50 m', value: '0/16' },
                { distance: '100 m', value: '0/16' },
                { distance: '150 m', value: '0/16' },
                { distance: '200 m', value: '0/16' },
            ],
            columns: [
                { name: 'Player' },
                { name: '140 m' },
                { name: '250 m' },
                { name: '360 m' },
                { name: '430 m' },
                { name: '430 m' },
            ],
            playersData: [
                { name: 'Nader Shakshak', position: 'aHead' },
                { name: 'Shakshak', position: 'asHead' },
                { name: 'Nader', position: 'adHead' },
                { name: 'Shak', position: 'afHead' },
            ],
        },
        {
            phaseTitle: 'Phase Title (2/4)',
            phase: '3nd Phase',
            activity: 'Jump',
            distance: '100 meters',
            segments: [
                { distance: '50 m', value: '0/16' },
                { distance: '100 m', value: '0/16' },
                { distance: '150 m', value: '0/16' },
                { distance: '200 m', value: '0/16' },
            ],
            columns: [
                { name: 'Player' },
                { name: '190 m' },
                { name: '270 m' },
                { name: '270 m' },
                { name: '360 m' },
                { name: '450 m' },
                { name: '450 m' },
                { name: '450 m' },
            ],
            playersData: [
                { name: 'Nader Shakshak', position: 'aHead' },
                { name: 'Shakshak', position: 'asHead' },
                { name: 'Nader', position: 'adHead' },
                { name: 'Shak', position: 'afHead' },
            ],
        },
    ];

    const handleCardClick = (card: any) => {
        setActiveCard(card.activity);
        processCardData(card);
    };

    const processCardData = (data: any) => {
        setActiveData(data);
    };

    return (
        <Theme.Body>
            <Header />
            <Theme.Wrapper>
                <Theme.LeftWrapper className="scrollable">
                    {cardData.map((card: any) => (
                        <Card
                            key={card.activity}
                            isActive={card.activity === activeCard}
                            onClick={(data: any) => handleCardClick(data)}
                        >
                            {card}
                        </Card>
                    ))}
                    <hr />
                </Theme.LeftWrapper>
                <Theme.RightWrapper>
                    <Theme.TitleSpan>{activeData?.phaseTitle}</Theme.TitleSpan>
                    <TabCardComponant data={activeData} />
                </Theme.RightWrapper>
            </Theme.Wrapper>
        </Theme.Body>
    );
};
