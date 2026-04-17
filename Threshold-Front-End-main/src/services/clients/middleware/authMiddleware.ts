import { FetchLike, WretchOptions, WretchResponse } from 'wretch';
import { extractErrorMessage } from './extractErrorMessage';
import { store } from 'store';
import { langSelector, tokenSelector } from 'services/interceptors/selectors';

const authMiddleware = (next: FetchLike) => {
    return async (url: string, opts: WretchOptions): Promise<WretchResponse> => {
        const state = store.getState();
        const authToken = tokenSelector(state);
        const lang = langSelector(state);

        if (authToken) {
            opts.headers = {
                ...opts.headers,
                Authorization: `Bearer ${authToken}`,
            };
        }

        if (lang) {
            opts.headers = {
                ...opts.headers,
                'Accept-Language': lang,
            };
        }

        try {
            console.log('Middleware console.', url);
            const result = await next(url, opts);
            return result;
        } catch (error) {
            const errorMessage = extractErrorMessage(error);
            throw new Error(errorMessage);
        }
    };
};

export default authMiddleware;
