import React from 'react';
import { Button as DefaultButton } from './Theme';
import { LoadingState } from 'libs/types';
import { useLocales } from 'hooks/locales';

interface ButtonProps {
    loading?: string;
    isLoading?: boolean;
    children?: React.ReactNode;
}

export const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & ButtonProps> = ({
    loading,
    isLoading,
    children,
    ...rest
}) => {
    const { trans } = useLocales();
    const showLoading = isLoading || LoadingState.Pending === loading;

    return (
        <DefaultButton {...rest}>
            {showLoading ? <div>{trans('g.loading', 'loading...')}</div> : children}
        </DefaultButton>
    );
};
