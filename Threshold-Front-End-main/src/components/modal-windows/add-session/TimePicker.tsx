import React, { useState } from 'react';
import { useController } from 'react-hook-form';
import { IMaskInput, IMask } from 'react-imask';
import classNames from 'classnames';

interface TimePickerProps {
    name: string;
    control: any;
}

const TimePicker: React.FC<TimePickerProps> = ({ name, control }) => {
    const {
        field: { onChange, onBlur, value, ref },
        fieldState: { invalid, error },
    } = useController({
        name,
        control,
        defaultValue: '',
    });

    const [meridiem, setMeridiem] = useState('AM');

    const handleChange = (newValue: string) => {
        const timeValue = `${newValue} ${meridiem}`;
        onChange(timeValue);
    };

    return (
        <div className={'relative flex flex-col items-start'}>
            <div className="flex flex-wrap" dir={'ltr'}>
                <IMaskInput
                    className="w-[55px]"
                    mask="HH:MM"
                    blocks={{
                        HH: {
                            mask: IMask.MaskedRange,
                            from: 1,
                            to: 12,
                            maxLength: 2,
                        },
                        MM: {
                            mask: IMask.MaskedRange,
                            from: 0,
                            to: 59,
                            maxLength: 2,
                        },
                    }}
                    value={value}
                    onAccept={handleChange}
                    onBlur={onBlur}
                    ref={ref}
                    placeholder="HH:MM"
                    style={{ borderColor: invalid ? 'red' : 'initial' }}
                    aria-invalid={invalid ? 'true' : 'false'}
                />

                <select
                    tabIndex={-1}
                    value={meridiem}
                    onChange={(e) => setMeridiem(e.target.value)}
                    className="ml-2 border rounded p-1"
                >
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                </select>
            </div>
            <span className={classNames('block text-red-500', { visible: !invalid })}>
                {error?.message}
            </span>
        </div>
    );
};

export default TimePicker;
