import { get } from 'lodash';
import { PUBLIC_ROUTES } from 'libs/constants';
import { StoreState } from 'libs/types';
import { persistor, store } from 'store';
import { RouteName } from 'libs/enums';

const authenticationMiddleware = () => (toState: any, fromState: any, done: any) => {
    const authAction = async () => {
        const nextState = get(toState, 'name', null) as RouteName | null | any;
        const isPublicRoute = PUBLIC_ROUTES.includes(nextState);
        const hasAccessToken = (store.getState() as StoreState).auth?.entities?.access_token;

        const isPrivatePage = !isPublicRoute && hasAccessToken;
        const isPublicPage = isPublicRoute && !hasAccessToken;

        if (isPrivatePage || isPublicPage) {
            done();
            return;
        }

        if (hasAccessToken) {
            if (nextState === RouteName.HOME) {
                done();
                return;
            }

            done({
                redirect: {
                    name: RouteName.HOME,
                    path: '/',
                    meta: { options: { replace: true }, redirected: true },
                },
            });
            return;
        }

        if ([RouteName.SIGN_IN, RouteName.SIGN_UP].includes(nextState)) {
            done();
            return;
        }

        done({
            redirect: {
                name: RouteName.SIGN_IN,
                path: '/signin',
                meta: { options: { replace: true }, redirected: true },
            },
        });
    };

    if (persistor.getState().bootstrapped) authAction();
    persistor.subscribe(authAction);
};

export default authenticationMiddleware;
