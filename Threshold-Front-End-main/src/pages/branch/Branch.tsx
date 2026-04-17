import React from 'react';
import { useRouter } from 'react-router5';
import * as Theme from './Theme';
import * as SharedTheme from '../Theme';
import { useLocales } from 'hooks/locales';
import { AthletesTable, CoachesTable, TeamsTable } from 'components/tables';
import { Loader } from 'components';
import { BranchInfoTable } from 'components/tables/BranchInfoTable';
import { useFetchBranchById } from 'services/hooks';
import { BranchManagerTable } from 'components/tables/BranchManagerTable';

export const BranchPage: React.FC = () => {
    const { trans } = useLocales();
    const router = useRouter();
    const {
        params: { id },
    } = router.getState();

    const { data: branch, isLoading } = useFetchBranchById(id);

    if (isLoading) return <Loader />;

    return (
        <Theme.CoachBody>
            <BranchInfoTable branch={branch?.payload as any} />

            <BranchManagerTable />

            <div className="flex flex-col w-full">
                <SharedTheme.Title variant="h2" value={trans('branch.athletes')} />

                <SharedTheme.TableContainer>
                    <AthletesTable athletes={branch?.payload.athletes || []} />
                </SharedTheme.TableContainer>
            </div>
            <div className="flex flex-col w-full">
                <SharedTheme.Title variant="h2" value={trans('branch.coaches')} />

                <SharedTheme.TableContainer>
                    <CoachesTable coaches={branch?.payload.coaches || []} />
                </SharedTheme.TableContainer>
            </div>
            <div className="flex flex-col w-full">
                <SharedTheme.Title variant="h2" value={trans('branch.teams')} />

                <SharedTheme.TableContainer>
                    <TeamsTable teams={branch?.payload.teams || []} />
                </SharedTheme.TableContainer>
            </div>
        </Theme.CoachBody>
    );
};
