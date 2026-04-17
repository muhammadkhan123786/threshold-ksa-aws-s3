import React, { useState } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { YearGoalModal } from 'components/yearGoalModal';

export const Gallery: React.FC = () => {
    const { trans } = useLocales();
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <Theme.Body>
            <YearGoalModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            <Theme.StatusBar>
                <Theme.UsersNumberTable>{trans('All(0)')}</Theme.UsersNumberTable>
                <Theme.ButtonsWrapper type="button" onClick={() => setIsModalOpen(true)}>
                    <Theme.ButtonIcon
                        src="/assets/icons/add-icon.svg"
                        height={16}
                        width={16}
                        alt="Add Icon"
                    />
                    {trans('add.an.image')}
                </Theme.ButtonsWrapper>
            </Theme.StatusBar>
        </Theme.Body>
    );
};
