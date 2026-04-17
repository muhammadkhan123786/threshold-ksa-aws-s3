import React, { ReactNode } from 'react';
import * as Theme from './Theme';
import { useLocales } from 'hooks/locales';

interface SharedButtonProps {
    onClick?: () => void;
    disabled?: boolean;
    icon?: React.ElementType;
    children: ReactNode;
    variant?: 'primary' | 'secondary';
    type?: string;
    style?: React.CSSProperties;
    loading?: boolean;
}

export const SharedButton: React.FC<SharedButtonProps> = ({
    onClick,
    disabled,
    icon: Icon,
    children,
    variant = 'primary',
    style,
    loading,
}) => {
    const { trans } = useLocales();

    return (
        <Theme.SharedButton
            type="button"
            onClick={onClick}
            disabled={disabled || loading}
            variant={variant}
            style={style}
        >
            {loading ? (
                <span>{trans('loading')}</span>
            ) : (
                <>
                    {Icon && <Icon />}
                    {children}
                </>
            )}
        </Theme.SharedButton>
    );
};
