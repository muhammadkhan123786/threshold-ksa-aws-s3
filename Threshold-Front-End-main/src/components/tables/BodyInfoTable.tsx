import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { controlsSlice } from 'store';
import { Table } from 'components/table';
import { Athlete, AthleteBiometric } from 'libs/types';
import { calculateYearsDifference, checkIsAfterAge18, stringToDateString } from 'libs/helpers';
import { ReactNode, useEffect, useState } from 'react';

interface Props {
    athleteBioArray: AthleteBiometric[];
    athlete: Athlete;
}

export const BodyInfoTable = ({ athleteBioArray, athlete }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const [isAfterAge18, setIsAfterAge18] = useState(false);

    const rows: ReactNode[][] = athleteBioArray
        ? athleteBioArray.map((bio) => {
              const row = [
                  <>{stringToDateString(bio?.date || '')}</>,
                  <>{bio?.weight}</>,
                  <>{bio?.height}</>,
                  <>{Number(bio?.bmi).toFixed(2)}</>,
                  <>{trans(`athlete.body.${bio?.status}`)}</>,
              ];

              if (!isAfterAge18) {
                  row.splice(4, 0, <>{Number(bio?.bmiPercentile).toFixed(2)}</>);
              }

              return row;
          })
        : [];

    const headerRow: ReactNode[] = [
        trans('athlete.body.date'),
        trans('athlete.body.weight'),
        trans('athlete.body.height'),
        trans('athlete.body.bmi'),
        !isAfterAge18 && trans('athlete.body.bmiPercentile'),
        trans('athlete.body.status'),
    ].filter(Boolean);

    const handleUpdate = async () => {
        dispatch(
            controlsSlice.actions.setModalContent({
                modalContent: {
                    type: 'addBodyComposition',
                    title: trans('form.addBodyComposition.title'),
                    subtitle: trans('form.addBodyComposition.subtitle'),
                },
            }),
        );
    };

    useEffect(() => {
        if (!athlete?.dateOfBirth) return;
        setIsAfterAge18(checkIsAfterAge18(athlete?.dateOfBirth || ''));
    }, [athlete?.dateOfBirth]);

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('athlete.body')} />
                <Theme.Button onClick={handleUpdate} $isTable={true}>
                    {trans('athlete.update')}
                </Theme.Button>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={isAfterAge18 ? 5 : 6}
                        headerRow={headerRow}
                        rowsComponents={rows}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
