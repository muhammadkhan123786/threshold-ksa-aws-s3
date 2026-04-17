import React, { ReactNode } from 'react';
import * as Sentry from '@sentry/react';
import { useLocales } from 'hooks/locales';

interface ErrorBoundaryProps {
    children: ReactNode;
}

const ErrorFallback: React.FC = () => {
    const { trans } = useLocales();

    return (
        <div role="alert">
            <h2>{trans('error.message')}</h2>
            <button onClick={() => window.location.reload()}>{trans('error.reloadButton')}</button>
        </div>
    );
};

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => (
    <Sentry.ErrorBoundary fallback={<ErrorFallback />}>{children}</Sentry.ErrorBoundary>
);

export default ErrorBoundary;
