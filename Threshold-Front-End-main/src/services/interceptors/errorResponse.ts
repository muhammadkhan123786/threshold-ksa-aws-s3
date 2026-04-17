import axios from 'axios';
import get from 'lodash/get';
import { authSlice } from 'store/authSlice';
import { refreshToken as refreshTokenAction } from 'services/apis/auth/auth';
import { refreshTokenSelector } from './selectors';

enum HttpStatus {
    Unauthorized = 401,
}

interface ErrorResponse {
    config: {
        url: string;
        headers: any;
        _retry?: boolean;
    };
    response?: {
        status: HttpStatus;
    };
}

type Response = any;

const retryMap = new WeakMap();

const errorResponse = (store: any) => {
    return [
        (response: Response) => {
            return response;
        },

        async (error: ErrorResponse) => {
            console.error('Error occurred:', error);

            const responseStatus = get(error, 'response.status') as HttpStatus | undefined;
            const originalConfig = error.config;

            const isRetried = retryMap.get(originalConfig);

            if (responseStatus === HttpStatus.Unauthorized && !isRetried) {
                retryMap.set(originalConfig, true);

                try {
                    const refreshToken = refreshTokenSelector(store.getState());

                    const refreshResponse = await store.dispatch(
                        refreshTokenAction()({ refreshToken }),
                    );

                    const accessToken = refreshResponse.payload.data?.payload?.access_token;

                    if (!accessToken) {
                        console.error('Failed to refresh token: access token is undefined');
                        store.dispatch(authSlice.actions.resetAction());
                        window.location.reload();
                        return Promise.reject(error);
                    }

                    store.dispatch(
                        authSlice.actions.setAccessToken({
                            accessToken,
                            refreshToken,
                        }),
                    );

                    const newConfig = { ...originalConfig };
                    newConfig.headers.Authorization = `Bearer ${accessToken}`;

                    return axios(newConfig);
                } catch (refreshError) {
                    console.error('Error refreshing token:', refreshError);
                    store.dispatch(authSlice.actions.resetAction());
                    window.location.reload();
                    return Promise.reject(refreshError);
                }
            } else {
                console.log('No retry needed or already retried.');
            }

            return Promise.reject(error);
        },
    ];
};

export default errorResponse;
