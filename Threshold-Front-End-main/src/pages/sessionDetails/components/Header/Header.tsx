import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Divider } from 'components/modal-windows';
import { router } from 'routers';

const Header = () => {
    const { trans } = useLocales();
    const [sessionActive, setSessionActive] = useState(false);
    const cards = ['Freestyle', 'Jump', 'Sprint'];
    type CardType = 'Freestyle' | 'Jump' | 'Sprint';
    const [activeCard, setActiveCard] = useState<CardType>('Freestyle');
    const {
        params: { sportId },
    } = router.getState();
    const playerData: Record<CardType, { name: string }[]> = {
        Freestyle: [{ name: 'Player A' }, { name: 'Player B' }, { name: 'Player C' }],
        Jump: [{ name: 'Player D' }, { name: 'Player E' }, { name: 'Player F' }],
        Sprint: [{ name: 'Player G' }, { name: 'Player H' }, { name: 'Player I' }],
    };

    const toggleSession = () => {
        setSessionActive((prev) => !prev);
    };
    const redirect = () => {
        router.navigate(`invited-player`);
    };
    return (
        <Theme.HeaderWrapper>
            <Theme.TopHeaderWrapper>
                <Theme.ItemsHeaderWrapper>
                    <Theme.UserInfoCard>
                        <Theme.ClubLogoWrapper>
                            <img src="/assets/images/club-logo.svg" alt="club logo" />
                        </Theme.ClubLogoWrapper>
                        <Theme.UserInfoStatus>
                            <Theme.DarkLabel>Swimmers</Theme.DarkLabel>
                            <Theme.LeighLabel>(male, 12)</Theme.LeighLabel>
                        </Theme.UserInfoStatus>
                    </Theme.UserInfoCard>
                    <Theme.SessionInfoWrapper>
                        <Theme.DarkLabel>Session Title</Theme.DarkLabel>
                        <Theme.SessionTitleWrapper>
                            <img src="/assets/icons/flag.svg" alt="club logo" />
                            <Theme.LeighLabel>Big Pool 2</Theme.LeighLabel>
                        </Theme.SessionTitleWrapper>
                    </Theme.SessionInfoWrapper>
                </Theme.ItemsHeaderWrapper>
                <Theme.TimeWrapper>
                    <Theme.TimeColumn>
                        <Theme.LeighLabel>starts</Theme.LeighLabel>
                        <Theme.DarkLabel>2:30 pm</Theme.DarkLabel>
                    </Theme.TimeColumn>
                    <Theme.TimeColumn>
                        <Theme.LeighLabel>ends</Theme.LeighLabel>
                        <Theme.DarkLabel>6:00 pm</Theme.DarkLabel>
                    </Theme.TimeColumn>
                </Theme.TimeWrapper>
                <Theme.FitnessWrapper>
                    <Theme.FitnessInfo>
                        <Theme.FitnessText bgColor="#C0D33014" textColor="#C0D330">
                            Fitness Battery
                        </Theme.FitnessText>
                        <Theme.FitnessText bgColor="#FFC00014" textColor="#FFC000">
                            Examine the capability
                        </Theme.FitnessText>
                        <Theme.FitnessText bgColor="inherit" textColor="#2024034d">
                            within
                        </Theme.FitnessText>
                        <Theme.FitnessText bgColor="#FFC00014" textColor="#FFC000">
                            10 times
                        </Theme.FitnessText>
                    </Theme.FitnessInfo>
                    <div>
                        <Theme.EditButton onClick={() => console.log('click')}>
                            <img src="/assets/icons/edit.svg" alt="edit" />
                            {trans('edit')}
                        </Theme.EditButton>
                    </div>
                </Theme.FitnessWrapper>
            </Theme.TopHeaderWrapper>
            <Divider />
            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                <Theme.ButtonsWrapper>
                    <Theme.EditButton onClick={() => redirect()}>
                        <img
                            src="/assets/icons/menu/players-icon.svg"
                            alt="edit"
                            height={18}
                            width={18}
                        />
                        Invited Players
                    </Theme.EditButton>
                    <div
                        style={{
                            flex: '1',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}
                    >
                        {sessionActive && (
                            <Theme.RegularSessionDetails>
                                All: 21 | Attended: 20 | Absent: 1
                            </Theme.RegularSessionDetails>
                        )}
                        {sessionActive && (
                            <Theme.SessionDetails>
                                <Theme.FullScreenButton
                                    onClick={() => console.log('FullScreenButton')}
                                >
                                    <img src="/assets/icons/fullscreen.svg" alt="fullscreen" />
                                    <Theme.DurationText>Full Screen</Theme.DurationText>
                                </Theme.FullScreenButton>
                                <Theme.TimerIcon>
                                    <img src="/assets/icons/timer.svg" alt="timer" />
                                </Theme.TimerIcon>
                                <Theme.DurationText>Duration: 00:45:30</Theme.DurationText>
                            </Theme.SessionDetails>
                        )}
                    </div>
                    <Theme.CreateSessionButton
                        onClick={toggleSession}
                        bgColor={sessionActive ? '#EB5353' : '#c0d330'}
                    >
                        {sessionActive ? 'End Session' : 'Start Session'}
                    </Theme.CreateSessionButton>
                </Theme.ButtonsWrapper>
            </div>
            <div>
                <p>
                    The description, the description. The description, the description. The
                    description, the description. The description, the description.
                </p>
            </div>
            {/* <Wrapper>
                <LeftWrapper>
                    {cards.map((card) => (
                        <Card
                            key={card}
                            isActive={card === activeCard}
                            onClick={() => setActiveCard(card)}
                        >
                            {card}
                        </Card>
                    ))}
                </LeftWrapper>
                <RightWrapper>
                    <Table>
                        <thead>
                            <tr>
                                <th>Player Name</th>
                                <th>Performance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {playerData[activeCard].map((player) => (
                                <tr key={player.name}>
                                    <td>{player.name}</td>
                                    <td>
                                        <input
                                            type="text"
                                            placeholder="Enter data"
                                            disabled={!sessionActive}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </RightWrapper>
            </Wrapper> */}
        </Theme.HeaderWrapper>
    );
};

export default Header;
