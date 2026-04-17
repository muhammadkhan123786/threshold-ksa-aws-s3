import React from 'react';
import { useLocales } from 'hooks/locales';
import * as Theme from './Theme';
import useSoftDeletePlanningSession from 'services/hooks/sessions/useSoftDeletePlanningSession';
import useFetchSessionAndPlanningSessions from 'services/hooks/sessions/useFetchSessionAndPlanningSessions';
import router from 'routers/router';

interface Drill {
    id: string;
    title: string;
    description: string;
    theme: string;
    space: string;
    trainingLoad: string;
    timeLoad: string;
    drillImage: string;
}

interface DrillItemProps {
    drill: Drill;
}

const DrillItem: React.FC<DrillItemProps> = ({ drill }) => {
    const { trans } = useLocales();

    const {
        params: { id },
    } = router.getState();

    const { refetch } = useFetchSessionAndPlanningSessions(id);
    const { mutate: softDelete, isPending } = useSoftDeletePlanningSession({
        onSuccess: () => {
            refetch();
        },
    });
    return (
        <Theme.DrillContainer>
            <Theme.DrillImageBody>
                <Theme.ImageTitle>
                    {trans('drill.image', { defaultValue: 'Drill image' })}
                </Theme.ImageTitle>
                <Theme.DrillImage src={`${drill.drillImage}`} alt="Drill" />
            </Theme.DrillImageBody>
            <Theme.DrillDetails>
                <Theme.SectionTitle>
                    {trans('confirm-session.drillDetails', { defaultValue: 'Drill details' })}
                </Theme.SectionTitle>
                <Theme.DrillTitle>
                    {trans('form.confirm-session.drill.title', { defaultValue: 'Drill title' })}
                </Theme.DrillTitle>
                <Theme.DrillDescription>{drill.title}</Theme.DrillDescription>
                <Theme.DrillTitle>
                    {trans('form.confirm-session.drill.description', {
                        defaultValue: 'Drill description',
                    })}
                </Theme.DrillTitle>
                <Theme.DrillDescription>{drill.description}</Theme.DrillDescription>
                <Theme.DrillInfoContainer>
                    <Theme.DrillInfoColumn>
                        <Theme.DrillInfoItem>
                            <span>
                                {trans('form.confirm-session.drill.theme', {
                                    defaultValue: 'Theme',
                                })}
                            </span>
                            <div>{drill.theme}</div>
                        </Theme.DrillInfoItem>
                        <Theme.DrillInfoItem>
                            <span>
                                {trans('form.confirm-session.drill.space', {
                                    defaultValue: 'Space',
                                })}
                            </span>
                            <div> {drill.space}</div>
                        </Theme.DrillInfoItem>
                    </Theme.DrillInfoColumn>
                    <Theme.DrillInfoColumn>
                        <Theme.DrillInfoItem>
                            <span>
                                {trans('form.confirm-session.drill.trainingLoad', {
                                    defaultValue: 'Training Load',
                                })}
                            </span>
                            <div>{drill.trainingLoad}</div>
                        </Theme.DrillInfoItem>
                        <Theme.DrillInfoItem>
                            <span>
                                {trans('form.confirm-session.drill.timeLoad', {
                                    defaultValue: 'Time Load',
                                })}
                            </span>
                            <div>{drill.timeLoad}</div>
                        </Theme.DrillInfoItem>
                    </Theme.DrillInfoColumn>
                </Theme.DrillInfoContainer>
                <Theme.Footer>
                    <Theme.RemoveDrillLink
                        disabled={isPending}
                        isLoading={isPending}
                        onClick={() => {
                            softDelete(drill.id);
                        }}
                    >
                        {trans('form.removeDrill', { defaultValue: 'Remove Drill' })}
                    </Theme.RemoveDrillLink>
                    {/* <Theme.UpdateDrillLink
                        disabled={isPending}
                        isLoading={isPending}
                        onClick={() => {
                            softDelete(drill.id);
                        }}
                    >
                        {trans('drill.updateDrill', { defaultValue: 'Update Drill' })}
                    </Theme.UpdateDrillLink> */}
                </Theme.Footer>
            </Theme.DrillDetails>
        </Theme.DrillContainer>
    );
};

export default DrillItem;
