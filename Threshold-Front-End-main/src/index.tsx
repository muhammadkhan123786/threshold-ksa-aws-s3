import { RouterProvider } from 'react-router5';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import App from 'app/App';
import { router } from 'routers';
import reportWebVitals from './reportWebVitals';
import { I18nProvider } from './locales';
import { HelmetProvider } from 'react-helmet-async';
import 'theme/index.css';
import { persistor, store } from 'store';
import * as Sentry from '@sentry/react';
import ErrorFallback from 'ErrorFallback';

const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN || '';
const TRACING_ORIGINS = (process.env.REACT_APP_SENTRY_TRACING_ORIGINS || '').split(',');
const TRACES_SAMPLE_RATE = parseFloat(process.env.REACT_APP_TRACES_SAMPLE_RATE || '1.0');
const REPLAYS_SESSION_SAMPLE_RATE = parseFloat(
    process.env.REACT_APP_REPLAYS_SESSION_SAMPLE_RATE || '0.1',
);
const REPLAYS_ON_ERROR_SAMPLE_RATE = parseFloat(
    process.env.REACT_APP_REPLAYS_ON_ERROR_SAMPLE_RATE || '1.0',
);

Sentry.init({
    dsn: SENTRY_DSN,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
    tracesSampleRate: TRACES_SAMPLE_RATE,
    tracePropagationTargets: TRACING_ORIGINS,
    replaysSessionSampleRate: REPLAYS_SESSION_SAMPLE_RATE,
    replaysOnErrorSampleRate: REPLAYS_ON_ERROR_SAMPLE_RATE,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
    <HelmetProvider>
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <RouterProvider router={router}>
                    <I18nProvider>
                        <ErrorFallback>
                            <App />
                        </ErrorFallback>
                    </I18nProvider>
                </RouterProvider>
            </PersistGate>
        </Provider>
    </HelmetProvider>,
);

reportWebVitals();
