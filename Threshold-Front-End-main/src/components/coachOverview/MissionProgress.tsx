import React from 'react';
import * as Theme from './Theme';

interface Session {
    name: string;
    progress: number;
    total: number;
}

interface MissionProgressProps {
    currentValue: number;
    maxValue: number;
    sessions: Session[];
    dateRange: string;
}

export const MissionProgress: React.FC<MissionProgressProps> = ({
    currentValue,
    maxValue,
    sessions,
    dateRange,
}) => {
    const progressPercentage = (currentValue / maxValue) * 100;
    return (
        <Theme.MissionProgressContainer>
            <Theme.ProgressSection>
                <Theme.ProgressContainer>
                    <Theme.SubGoalTitle>Current Sub-Goal (January)</Theme.SubGoalTitle>
                    <Theme.CircularProgress>
                        <svg viewBox="0 0 44 25">
                            {/* Background path */}
                            <path
                                d="M4 21 A 18 18 0 0 1 40 21"
                                fill="none"
                                stroke="rgba(234, 236, 240, 1)"
                                strokeWidth="6"
                                strokeLinecap="butt"
                            />
                            {/* Progress path */}
                            <path
                                d="M4 21 A 18 18 0 0 1 40 21"
                                fill="none"
                                stroke="rgba(210, 225, 128, 1)"
                                strokeWidth="6"
                                strokeDasharray={`${(progressPercentage * 56.5) / 100}, 56.5`}
                                strokeLinecap="butt"
                            />
                        </svg>
                        <Theme.ProgressValue>
                            {currentValue}{' '}
                            <Theme.ProgressValueSpan>/{maxValue}</Theme.ProgressValueSpan>
                        </Theme.ProgressValue>
                    </Theme.CircularProgress>
                    <Theme.ProcessText>Get the maximum breath process</Theme.ProcessText>
                </Theme.ProgressContainer>
                <Theme.Divider />
                <Theme.SessionsList>
                    <Theme.SubGoalHeader>
                        <Theme.DateRangeContainer>
                            <p>Current Sub-Goal</p>
                            <p>{`[ ${dateRange} ]`}</p>
                        </Theme.DateRangeContainer>
                        <Theme.WarningBadge>
                            <Theme.WarningText>Spaces must achieved</Theme.WarningText>
                            <Theme.WarningSubText>within</Theme.WarningSubText>
                            <Theme.WarningText>2000 km</Theme.WarningText>
                        </Theme.WarningBadge>
                    </Theme.SubGoalHeader>
                    {sessions.map((session, index) => (
                        <Theme.SessionItem key={index}>
                            <span>{session.name}</span>
                            <Theme.ProgressBar
                                progress={(session.progress / session.total) * 100}
                            />
                            <Theme.Value>{session.progress} km</Theme.Value>
                        </Theme.SessionItem>
                    ))}
                </Theme.SessionsList>
            </Theme.ProgressSection>
        </Theme.MissionProgressContainer>
    );
};
