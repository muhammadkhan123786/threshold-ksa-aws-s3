import { includes } from 'lodash';
import { langSelector, tokenSelector } from './selectors';

const AUTH_CHECK_METHODS = ['post', 'put', 'patch', 'delete', 'get'] as const;

type RequestMethod = (typeof AUTH_CHECK_METHODS)[number];

interface Config {
    method: RequestMethod;
    headers: Record<string, string>;
}

const authRequest = (store: any) => {
    return [
        (config: Config) => {
            if (includes(AUTH_CHECK_METHODS, config.method)) {
                const authToken = tokenSelector(store.getState());
                const lang = langSelector(store.getState());

                if (authToken) config.headers['Authorization'] = `Bearer ${authToken}`;
                if (lang) config.headers['Accept-Language'] = lang;
            }

            return config;
        },
        (error: { data: { error: { message: string } } }) => {
            return Promise.reject(error.data.error.message);
        },
    ];
};

export default authRequest;
