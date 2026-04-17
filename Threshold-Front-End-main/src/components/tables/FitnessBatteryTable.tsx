import { useDispatch } from 'react-redux';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { controlsSlice } from 'store';
import { Table } from 'components/table';
import { AthleteFitnessBattery } from 'libs/types';
import { stringToDateString } from 'libs/helpers';
import { ReactNode } from 'react';
import styled from 'styled-components';
import { BATTERY_DATE_THRESHOLD } from 'libs/constants';

interface Props {
    athleteBatteryArray: AthleteFitnessBattery[];
}

const ColoredCell = styled.div<{
    $data: { name: 'curl' | 'push' | 'trunk' | 'sit' | 'pacer'; data: string };
    $thresholdMapping: any;
}>`
    background-color: ${(props) =>
        Number(props.$data.data) <= props.$thresholdMapping[props.$data.name]
            ? '#ff51513a'
            : 'transparent'};
`;

export const FitnessBatteryTable = ({ athleteBatteryArray }: Props) => {
    const { trans } = useLocales();
    const dispatch = useDispatch();

    const thresholdMapping = {
        curl: BATTERY_DATE_THRESHOLD[0],
        push: BATTERY_DATE_THRESHOLD[1],
        trunk: BATTERY_DATE_THRESHOLD[2],
        sit: BATTERY_DATE_THRESHOLD[3],
        pacer: BATTERY_DATE_THRESHOLD[4],
    };

    const rows: ReactNode[][] = !athleteBatteryArray
        ? []
        : athleteBatteryArray.map((battery, index) => [
              <>{stringToDateString(battery?.date || '')}</>,
              <ColoredCell
                  $thresholdMapping={thresholdMapping}
                  $data={{ name: 'curl', data: battery?.curl }}
                  key={`curl: ${index}`}
              >
                  {battery?.curl}
              </ColoredCell>,
              <ColoredCell
                  $thresholdMapping={thresholdMapping}
                  $data={{ name: 'push', data: battery?.push }}
                  key={`push: ${index}`}
              >
                  {battery?.push}
              </ColoredCell>,
              <ColoredCell
                  $thresholdMapping={thresholdMapping}
                  $data={{ name: 'trunk', data: battery?.trunk }}
                  key={`trunk: ${index}`}
              >
                  {battery?.trunk}
              </ColoredCell>,
              <ColoredCell
                  $thresholdMapping={thresholdMapping}
                  $data={{ name: 'sit', data: battery?.sit }}
                  key={`sit: ${index}`}
              >
                  {battery?.sit}
              </ColoredCell>,
              <ColoredCell
                  $thresholdMapping={thresholdMapping}
                  $data={{ name: 'pacer', data: battery?.pacer }}
                  key={`pacer: ${index}`}
              >
                  {battery?.pacer}
              </ColoredCell>,
          ]);

    const handleUpdate = async () => {
        dispatch(
            controlsSlice.actions.setModalContent({
                modalContent: {
                    type: 'addFitnessBattery',
                    title: trans('form.addFitnessBattery.title'),
                    subtitle: trans('form.addFitnessBattery.subtitle'),
                },
            }),
        );
    };

    return (
        <Theme.Section>
            <Theme.ButtonWrapper>
                <Theme.Title variant="h2" value={trans('athlete.battery')} />
                <Theme.Button onClick={handleUpdate} $isTable={true}>
                    {trans('athlete.update')}
                </Theme.Button>
            </Theme.ButtonWrapper>
            <Theme.ScrollWrapper>
                <Theme.TableWrapper>
                    <Table
                        columns={6}
                        headerRow={[
                            <>{trans('athlete.battery.date')}</>,
                            <>{trans('athlete.battery.curl')}</>,
                            <>{trans('athlete.battery.push')}</>,
                            <>{trans('athlete.battery.trunk')}</>,
                            <>{trans('athlete.battery.sit')}</>,
                            <>{trans('athlete.battery.pacer')}</>,
                        ]}
                        rowsComponents={rows}
                    />
                </Theme.TableWrapper>
            </Theme.ScrollWrapper>
        </Theme.Section>
    );
};
