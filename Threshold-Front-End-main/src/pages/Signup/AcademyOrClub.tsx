import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';
import { AcademyIcon, ClubIcon } from './signup-icons';
import { useFormContext } from 'react-hook-form';
import { useEffect } from 'react';

const AcademyOrClub = () => {
    const { trans } = useLocales();
    const { setValue, watch } = useFormContext();

    const selectedValue = watch('organizationType');

    useEffect(() => {
        if (selectedValue === undefined) {
            setValue('organizationType', 'academy', { shouldValidate: true });
        }
    }, [selectedValue, setValue]);

    const options = [
        {
            value: 'academy',
            label: trans('signup.academy'),
            icon: <AcademyIcon color={selectedValue === 'academy' ? '#C0D330' : '#202403D9'} />,
        },
        {
            value: 'club',
            label: trans('signup.club'),
            icon: <ClubIcon color={selectedValue === 'club' ? '#C0D330' : '#202403D9'} />,
        },
    ];

    const handleSelect = (value: string) => {
        setValue('organizationType', value, { shouldValidate: true });
    };

    return (
        <Theme.OptionsContainer>
            {options.map((option) => (
                <Theme.OptionCard
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleSelect(option.value);
                    }}
                    role="button"
                    tabIndex={0}
                    isSelected={selectedValue === option.value} // Highlight the selected option
                >
                    <Theme.OptionIcon isSelected={selectedValue === option.value}>
                        {option.icon}
                    </Theme.OptionIcon>
                    <Theme.OptionLabel>{option.label}</Theme.OptionLabel>
                </Theme.OptionCard>
            ))}
        </Theme.OptionsContainer>
    );
};

export default AcademyOrClub;
