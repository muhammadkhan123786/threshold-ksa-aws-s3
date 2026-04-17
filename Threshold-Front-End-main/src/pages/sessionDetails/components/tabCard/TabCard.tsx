import React from 'react';
import * as Theme from './Theme';
import { Table } from 'components/table';
import { Controller, useForm } from 'react-hook-form';
import { InputController } from 'components';
import { useLocales } from 'hooks/locales';

interface CardProps {
    data: any;
}

export const TabCardComponant: React.FC<CardProps> = ({ data }) => {
    const { control } = useForm();
    const { trans } = useLocales();
    return (
        <Theme.TabCard>
            <table>
                <thead>
                    <tr>
                        {data?.columns?.map((column: any, index: number) => (
                            <Theme.TableHeader key={index}>{column?.name}</Theme.TableHeader>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data?.columns?.map((row: any, rowIndex: number) => (
                        <Theme.TableRow key={rowIndex}>
                            {data?.columns?.map((column: any, colIndex: number) => (
                                <Theme.TableCell key={colIndex}>
                                    <Controller
                                        control={control}
                                        name={`${column?.name}`}
                                        defaultValue={row[column?.name]}
                                        render={({ field }) => (
                                            <InputController
                                                {...field}
                                                control={control}
                                                placeholder={trans('placeholder.sec')}
                                                required
                                            />
                                        )}
                                    />
                                </Theme.TableCell>
                            ))}
                        </Theme.TableRow>
                    ))}
                </tbody>
            </table>
        </Theme.TabCard>
    );
};
{
    /* <Theme.TableCell key={colIndex}>
<Controller
    control={control}
    name={`${column?.name}`}
    render={({ field }) => (
        <>
            <InputController
                {...field}
                control={control}
                placeholder={trans('placeholder.username')}
                required
            />
        </>
    )}
/>
</Theme.TableCell> */
}
