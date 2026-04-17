import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { Table } from 'components/table';
import { Athlete, AthleteProfile } from 'libs/types';
import { AthleteStatus, HandStatus, PlayerPosition, SportProfileType } from 'libs/enums';
import { StatusIndicator } from 'components/status-indicator';
import { setCurrentProfile } from 'store/academySlice';
import { setModalContent } from 'store/controlsSlice';
import { valueToSelectOption } from 'libs/helpers';

interface Props {
    athlete: Athlete;
    profiles: AthleteProfile[];
}

export const ProfilesTable = ({ athlete, profiles }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const handleAddProfile = () => {
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'addSportProfileType',
                    title: trans('form.editSportProfileType.title'),
                    subtitle: '',
                },
            }),
        );
    };

    const handleUpdateProfile = (profile: AthleteProfile) => {
        dispatch(
            setCurrentProfile({
                currentProfile: profile,
            }),
        );
        dispatch(
            setModalContent({
                modalContent: {
                    type: 'editSportProfileType',
                    title: trans('form.editSportProfileType.title'),
                    subtitle: '',
                    defaults: {
                        status: valueToSelectOption(
                            profile.status,
                            AthleteStatus,
                            trans,
                            'global.',
                        ),
                        sport: valueToSelectOption(
                            profile.sport,
                            SportProfileType,
                            trans,
                            'sport.',
                        ),
                        hand: valueToSelectOption(profile.hand || '', HandStatus, trans, 'global.'),
                        foot: valueToSelectOption(profile.foot || '', HandStatus, trans, 'global.'),
                        position: valueToSelectOption(
                            profile.position || '',
                            PlayerPosition,
                            trans,
                            'global.',
                        ),
                    },
                },
            }),
        );
    };

    const rows = !profiles
        ? []
        : profiles.map((profile) => [
              <>{trans(`sport.${profile?.sport}`, profile?.sport)}</>,

              <div key={profile.id + profile.sport} className="flex border border-[#cada54]">
                  <p className="p-[2px_8px_2px_8px]">
                      {trans(`global.${profile.hand}` as string, {
                          defaultValue: profile.hand,
                      })}
                  </p>
              </div>,
              <div key={profile.id + profile.sport} className="flex border border-[#cada54]">
                  <p className="p-[2px_8px_2px_8px]">
                      {trans(`global.${profile.foot}`, { defaultValue: profile.foot })}
                  </p>
              </div>,
              <div key={profile.id + profile.sport} className="flex border border-[#cada54]">
                  <p className="p-[2px_8px_2px_8px]">
                      {trans(`global.${profile.position}`, { defaultValue: profile.position })}
                  </p>
              </div>,
              <StatusIndicator
                  key={profile.id + profile.sport}
                  isActive={profile.status === AthleteStatus.ACTIVE}
              />,
              <Theme.Button
                  key={`${profile.id}-button`}
                  style={{
                      width: 'fit-content',
                      height: 'fit-content',
                      fontSize: '15px',
                      padding: '5px 16px',
                      margin: '0px',
                  }}
                  onClick={() => handleUpdateProfile(profile)}
              >
                  {trans('athlete.profiles.update')}
              </Theme.Button>,
          ]);

    if (!rows.length) return <></>;
    return (
        <Theme.Section>
            <Theme.Title variant="h2" value={trans('athlete.profiles')} />
            <Theme.Button onClick={handleAddProfile} $isTable={true}>
                {trans('athlete.profiles.add')}
            </Theme.Button>
            <Theme.TableWrapper>
                <Table
                    columns={6}
                    headerRow={[
                        <>{trans('athlete.profiles.profile')}</>,
                        <>{trans('form.editAthleteDetails.position')}</>,
                        <>{trans('form.editAthleteDetails.hand')}</>,
                        <>{trans('form.editAthleteDetails.foot')}</>,
                        <>{trans('athlete.profiles.status')}</>,
                        <></>,
                    ]}
                    rowsComponents={rows}
                />
            </Theme.TableWrapper>
        </Theme.Section>
    );
};
