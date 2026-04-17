import React, { ReactNode, useId } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';

interface TableProps {
    columns: number;
    headerRow: ReactNode[];
    rowsComponents: ReactNode[][];
}

export const Table: React.FC<React.HTMLAttributes<HTMLTableElement> & TableProps> = ({
    columns,
    headerRow,
    rowsComponents,
    ...rest
}) => {
    const { trans } = useLocales();
    const id = useId();

    if (headerRow?.length !== columns)
        throw new Error('Number of cells in a row must equal the number of columns');

    if (!rowsComponents.every((rowComponents) => rowComponents?.length === columns))
        throw new Error('Length of each row must equal the number of columns');

    return (
        <Theme.Body {...rest}>
            <Theme.TableWrapper>
                <Theme.TableColumnGroup>
                    {Array(columns).fill(<Theme.TableColumn span={1} />)}
                </Theme.TableColumnGroup>

                <Theme.TableHeader>
                    <Theme.TableRow>
                        {headerRow &&
                            headerRow.map((headerComponent, index) => (
                                <Theme.TableHead key={`TableHeader ${id} number ${index}`}>
                                    {headerComponent}
                                </Theme.TableHead>
                            ))}
                    </Theme.TableRow>
                </Theme.TableHeader>

                <Theme.TableBody>
                    {rowsComponents &&
                        rowsComponents.map((rowComponents, index) => (
                            <Theme.TableRow key={`TableRow ${id} number ${index}`}>
                                {rowComponents &&
                                    rowComponents.map((Component, subIndex) => (
                                        <Theme.TableData key={`TableCell ${id} number ${subIndex}`}>
                                            {Component}
                                        </Theme.TableData>
                                    ))}
                            </Theme.TableRow>
                        ))}
                </Theme.TableBody>
            </Theme.TableWrapper>

            {rowsComponents?.length === 0 && (
                <Theme.EmptyTableWrapper>
                    <Theme.EmptyTableIcon src="/assets/icons/clock-icon.png" alt="clock" />
                    <Theme.EmptyTableText variant="p" value={trans('home.dashboard.empty')} />
                </Theme.EmptyTableWrapper>
            )}
        </Theme.Body>
    );
};
