import React, { useState, useEffect } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { SubGoalModal } from 'components/subGoalModal';
import { useFetchClubTeamsSubGoals } from 'services/hooks/teams/useFetchClubTeamsSubGoals';
import { router } from 'routers';
import { Loader } from 'components/loader';

interface PassedData {
    setSubGoalsData: any;
}

export const GoalStatusBoard: React.FC<PassedData> = ({ setSubGoalsData }) => {
    const { trans } = useLocales();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedGoal, setSelectedGoal] = useState<any>(null);

    const {
        params: { sportId, id },
    } = router.getState();

    const { data: SubGoalsTeamData, isLoading, error } = useFetchClubTeamsSubGoals(sportId, id);
    // إرسال البيانات للأب عند تحميلها
    useEffect(() => {
        if (setSubGoalsData && SubGoalsTeamData) {
            setSubGoalsData(SubGoalsTeamData);
        }
    }, [SubGoalsTeamData, setSubGoalsData]);

    if (isLoading) {
        return <Loader />;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleEditClick = (goal: any) => {
        setSelectedGoal(goal);
        setIsEditModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsEditModalOpen(false);
        setSelectedGoal(null);
    };

    return (
        <Theme.Body>
            <SubGoalModal isOpen={isEditModalOpen} onClose={handleCloseModal} goal={selectedGoal} />
            {SubGoalsTeamData?.data?.map((goal: any) => (
                <div key={goal.id}>
                    <Theme.MonthTitle>
                        <li>
                            {goal.title}
                            <Theme.ButtonOpenModal
                                type="button"
                                onClick={() => handleEditClick(goal)}
                            >
                                <img
                                    src="/assets/icons/edit.svg"
                                    height={16}
                                    width={16}
                                    alt="editGoal"
                                />
                            </Theme.ButtonOpenModal>
                        </li>
                    </Theme.MonthTitle>

                    {goal.weeks.map((week: any) => {
                        const progressPercentage =
                            week.totalSessions === 0
                                ? 0
                                : (week.neededSessions / (week.totalSessions || 0)) * 100;

                        let progressColor = '#eaecf0';
                        let textColor = '#202403d9';
                        if (week.neededSessions === 0) {
                            progressColor = '#0398550f';
                            textColor = '#039855';
                        } else if (week.neededSessions > 0 && week.neededSessions < 6) {
                            progressColor = '#ffc00014';
                            textColor = '#ffc000';
                        }

                        return (
                            <Theme.Weak key={week.id}>
                                <Theme.WeekItem>
                                    <Theme.WeekTitle>
                                        {trans(`title.weekNumber`)} &nbsp;&nbsp; {week.weekNumber}
                                    </Theme.WeekTitle>
                                    <Theme.DataItem
                                        style={{ backgroundColor: progressColor, color: textColor }}
                                    >
                                        <Theme.WeekDescription>
                                            {trans(`title.target`)}: {week.title}
                                        </Theme.WeekDescription>
                                        <Theme.WeekDetails>
                                            {trans('title.within')}
                                        </Theme.WeekDetails>
                                        <Theme.WeekDescription>
                                            {week.volumeTargeted}{' '}
                                            {trans(`volumeUnit.${week.volumeUnit}`)}
                                        </Theme.WeekDescription>
                                    </Theme.DataItem>
                                </Theme.WeekItem>

                                <Theme.ProgressBar>
                                    <Theme.ProgressText>
                                        <span>
                                            {week.neededSessions}/{week.totalSessions}{' '}
                                            {trans('sessions')}
                                        </span>
                                        <span>
                                            [{week.startDate} .. {week.endDate}]
                                        </span>
                                    </Theme.ProgressText>
                                    <Theme.ProgressTrack>
                                        <Theme.ProgressFill
                                            style={{
                                                width: `${progressPercentage}%`,
                                                backgroundColor: progressColor,
                                            }}
                                        />
                                    </Theme.ProgressTrack>
                                </Theme.ProgressBar>
                            </Theme.Weak>
                        );
                    })}
                </div>
            ))}
        </Theme.Body>
    );
};
