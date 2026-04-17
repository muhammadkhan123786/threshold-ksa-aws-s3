import { authRequest, errorResponse } from './';
import { clientAction } from 'services/templates/axios';

export const injector = (store: any) => {
    // Properly type the arguments for Axios interceptors
    clientAction.interceptors.request.use(...(authRequest(store) as any));
    clientAction.interceptors.response.use(...(errorResponse(store) as any));
};
