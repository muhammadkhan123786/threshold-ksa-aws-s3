import React, { forwardRef, useEffect, useState } from 'react';
import { useController, Control, UseFormTrigger } from 'react-hook-form';
import * as InputTheme from './Theme';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { useLocales } from 'hooks/locales';
import { Controls } from 'components';

interface InputControllerProps {
    name: string;
    control: Control<any>;
    label?: string;
    defaultValue?: string;
    withPortal?: boolean;
    minDate?: Date;
    maxDate?: Date;
    showMonthAsNumber?: boolean;
    dateFormat?: string;
    showWeekNumbers?: boolean;
    showWeekPicker?: boolean;
    trigger?: UseFormTrigger<any>;
    disabled?: boolean;
}

export const InputDateController: React.FC<
    InputControllerProps & React.InputHTMLAttributes<HTMLInputElement>
> = ({
    label,
    control,
    defaultValue,
    name,
    withPortal = true,
    minDate = new Date('01/01/1940'),
    maxDate = new Date('01/01/2050'),
    showMonthAsNumber,
    dateFormat,
    showWeekNumbers = false,
    showWeekPicker = false,
    disabled = false,
    trigger,
    ...rest
}) => {
    const { timezonDate, trans, formatDate } = useLocales();
    const { field, fieldState } = useController<any>({
        control,
        name,
        defaultValue: defaultValue ? timezonDate(defaultValue) : undefined,
    });

    const minYear = minDate.getFullYear();
    const maxYear = maxDate.getFullYear();

    const handleDateChange = (date: Date) => {
        const correctedDate = timezonDate(date);
        field.onChange(correctedDate);
        if (trigger) {
            trigger(name);
        }
    };

    const ExampleCustomInput = forwardRef((props: any, ref: any) => (
        <InputTheme.CustomButton
            type="button"
            {...{ ...props }}
            ref={ref}
            style={disabled ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
        >
            {field.value ? formatDate(props?.value) : trans('form.selectDate')}
        </InputTheme.CustomButton>
    ));

    const renderCustomHeader = ({
        date,
        changeYear,
        changeMonth,
    }: {
        date: Date;
        changeYear: (year: number) => void;
        changeMonth: (month: number) => void;
    }) => (
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center' }}>
            <select value={date.getMonth()} onChange={(e) => changeMonth(Number(e.target.value))}>
                {Array.from(Array(12).keys()).map((monthNumber) => (
                    <option key={monthNumber} value={monthNumber}>
                        {monthNumber + 1} {/* Display month number */}
                    </option>
                ))}
            </select>
            <select value={date.getFullYear()} onChange={(e) => changeYear(Number(e.target.value))}>
                {Array.from({ length: maxYear - minYear + 1 }, (_, i) => i + minYear).map(
                    (year) => (
                        <option key={year} value={year}>
                            {year}
                        </option>
                    ),
                )}
            </select>
        </div>
    );

    return (
        <InputTheme.Body {...rest}>
            <DatePicker
                id={`date-picker-${name}`}
                selected={field.value}
                onChange={handleDateChange}
                closeOnScroll={true}
                withPortal={withPortal}
                fixedHeight
                disabled={disabled}
                showMonthDropdown
                showYearDropdown
                dropdownMode="select"
                minDate={minDate}
                maxDate={maxDate}
                dateFormat={dateFormat}
                {...(dateFormat === 'yyyy' ? { showYearPicker: true } : {})}
                placeholderText={trans('form.selectDate')}
                customInput={<ExampleCustomInput />}
                renderCustomHeader={showMonthAsNumber ? renderCustomHeader : undefined}
                showWeekNumbers={showWeekNumbers}
                showWeekPicker={showWeekPicker}
            />
            {fieldState?.error?.message && (
                <Controls.Hint>{fieldState?.error?.message}</Controls.Hint>
            )}
        </InputTheme.Body>
    );
};
