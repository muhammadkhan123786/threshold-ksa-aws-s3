import wretch from 'wretch';
import QueryStringAddon from 'wretch/addons/queryString';
import authMiddleware from './middleware/authMiddleware';
import { extractErrorMessage } from './middleware/extractErrorMessage';

const baseUrl = process.env.REACT_APP_BACKEND_API_ENDPOINT || '';

console.log('Base URL: ', baseUrl);

const api = wretch()
    .url(baseUrl)
    .addon(QueryStringAddon)
    .middlewares([authMiddleware])
    .catcherFallback((error: unknown) => {
        const errorMessage = extractErrorMessage(error);
        throw new Error(errorMessage);
    });

export default api;
