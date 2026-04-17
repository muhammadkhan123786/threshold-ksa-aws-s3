import React from 'react';
import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Table } from 'components/table';
import { setModalContent } from 'store/controlsSlice';
import { Branch } from 'libs/types/branch';

interface Props {
    branch: Branch;
}

export const BranchInfoTable: React.FC<Props> = ({ branch }) => {
    const { trans, formatDate } = useLocales();
    const dispatch = useDispatch();

    // const handleEditInfo = () => {
    //     dispatch(
    //         setModalContent({
    //             modalContent: {
    //                 type: 'editBranchProfileInfo',
    //                 title: trans('form.editBranchPersonalInfo.title'),
    //                 subtitle: trans('form.editBranchPersonalInfo.subtitle'),
    //                 defaults: {
    //                     name: branch?.name,
    //                     description: branch?.description,
    //                 },
    //             },
    //         }),
    //     );
    // };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('branch.personal.Information')} />
                {/* 
                <Theme.Button onClick={handleEditInfo} $isTable={true}>
                    {trans('branch.personal.update')}
                </Theme.Button> */}
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={3}
                        headerRow={[
                            trans('form.addBranch.name'),
                            trans('form.addBranch.description'),
                            trans('form.addBranch.createat'),
                        ]}
                        rowsComponents={[
                            [
                                branch?.name || '-',
                                branch?.description || '-',
                                branch?.createdAt ? formatDate(branch.createdAt) : '-',
                            ],
                        ]}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
