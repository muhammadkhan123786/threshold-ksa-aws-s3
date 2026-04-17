import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { SubGoalModal } from 'components/subGoalModal';
import { YearGoalModal } from 'components/yearGoalModal';
import { GoalStatusBoard } from './goalsStatus';
import { useFetchClubTeamsMainGoals } from 'services/hooks/teams/useFetchClubTeamsMainGoals';
import { router } from 'routers';

export const Vision: React.FC<any> = (teamSession) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const { isRTL, trans } = useLocales();
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [subGoalsData, setSubGoalsData] = useState<any>(null);
    const [dataForYearGoal, setdataForYearGoal] = useState<any>();
    const {
        params: { sportId, id },
    } = router.getState();
    const { data, isLoading, error } = useFetchClubTeamsMainGoals(sportId, id);

    const formatDateRange = (startDate: string, endDate: string) => {
        if (!startDate || !endDate) return '';

        const start = new Date(startDate);
        const end = new Date(endDate);

        const startMonth = start.toLocaleString('en-US', { month: 'long' });
        const startYear = start.getFullYear();

        const endMonth = end.toLocaleString('en-US', { month: 'long' });
        const endYear = end.getFullYear();

        return `${startMonth}, ${startYear} - ${endMonth}, ${endYear}`;
    };

    const currentYearData = data?.data?.filter((item: any) => item.year === currentYear);
    const dateRange = formatDateRange(
        currentYearData?.[0]?.startDate,
        currentYearData?.[0]?.endDate,
    );

    const handlePreviousYear = () => {
        setCurrentYear((prevYear) => prevYear - 1);
        setdataForYearGoal(null);
    };
    const handleNextYear = () => {
        setCurrentYear((prevYear) => prevYear + 1);
        setdataForYearGoal(null);
    };
    return (
        <Theme.Body>
            <SubGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <YearGoalModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                existingGoal={dataForYearGoal}
                yearForMainGoal={currentYear}
            />

            <Theme.YearGoalComponent>
                <Theme.ButtonWrapper>
                    <Theme.ButtonRedirect type="button" onClick={handlePreviousYear}>
                        <Theme.ButtonIcon
                            src={
                                isRTL
                                    ? '/assets/icons/next-icon.svg'
                                    : '/assets/icons/left-arrow.svg'
                            }
                            height={16}
                            width={16}
                            alt="Previous Icon"
                        />
                        {trans((currentYear - 1).toString())}
                    </Theme.ButtonRedirect>
                </Theme.ButtonWrapper>
                <Theme.GoalTitleWrapper>
                    {currentYearData?.length > 0 ? (
                        <>
                            <Theme.SmallTextSpan>
                                {currentYearData[0]?.description}
                            </Theme.SmallTextSpan>
                            <Theme.GoaloftheYearText>
                                {currentYearData[0]?.title}
                                <Theme.ButtonOpenModal
                                    type="button"
                                    onClick={() => {
                                        setdataForYearGoal(currentYearData?.[0]);
                                        setIsEditModalOpen(true);
                                    }}
                                >
                                    <img
                                        src="/assets/icons/edit.svg"
                                        height={16}
                                        width={16}
                                        alt="editGoal"
                                    />
                                </Theme.ButtonOpenModal>
                            </Theme.GoaloftheYearText>
                            <Theme.SmallTextSpan>{dateRange}</Theme.SmallTextSpan>
                        </>
                    ) : (
                        <Theme.GoaloftheYearText>
                            {trans('no.main.goal')}
                            &nbsp;{currentYear}&nbsp;
                            {trans('add.goal.year')}
                            <Theme.ButtonOpenModal
                                type="button"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                <img
                                    src="/assets/icons/edit.svg"
                                    height={16}
                                    width={16}
                                    alt="editGoal"
                                />
                            </Theme.ButtonOpenModal>
                        </Theme.GoaloftheYearText>
                    )}
                </Theme.GoalTitleWrapper>
                <Theme.ButtonWrapper>
                    <Theme.ButtonRedirect type="button" onClick={handleNextYear}>
                        {trans((currentYear + 1).toString())}
                        <Theme.ButtonIcon
                            src={
                                isRTL
                                    ? '/assets/icons/left-arrow.svg'
                                    : '/assets/icons/next-icon.svg'
                            }
                            height={16}
                            width={16}
                            alt="Next Icon"
                        />
                    </Theme.ButtonRedirect>
                </Theme.ButtonWrapper>
            </Theme.YearGoalComponent>

            <Theme.StatusBar>
                <Theme.UsersNumberTable>
                    {trans(`table.sub.goals`)}
                    {`(${subGoalsData?.data?.length || 0})`}
                </Theme.UsersNumberTable>
                <Theme.ButtonsWrapper type="button" onClick={() => setIsModalOpen(true)}>
                    <Theme.ButtonIcon
                        src="/assets/icons/add-icon.svg"
                        height={16}
                        width={16}
                        alt="Add Icon"
                    />
                    {trans('add.sub.goal')}
                </Theme.ButtonsWrapper>
            </Theme.StatusBar>

            {/* Pass setSubGoalsData to GoalStatusBoard */}
            <GoalStatusBoard setSubGoalsData={setSubGoalsData} />
        </Theme.Body>
    );
};
