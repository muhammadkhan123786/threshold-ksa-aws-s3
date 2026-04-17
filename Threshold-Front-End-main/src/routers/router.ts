import createRouter from 'router5';
import browserPlugin from 'router5-plugin-browser';
import loggerPlugin from 'router5-plugin-logger';
import { isEmpty } from 'lodash';

import authenticationMiddleware from './middlewares/authenticationMiddleware';
import routes from './routes.json';
import { store } from 'store';

export const router = createRouter(routes, {
    allowNotFound: false,
    autoCleanUp: false,
    rewritePathOnMatch: true,
    defaultRoute: 'home',
});

router.usePlugin(browserPlugin());

if (process.env.ENABLE_ROUTER_LOGS === 'true') {
    router.usePlugin(loggerPlugin);
}

// router.setDependency('store', store);
router.useMiddleware(authenticationMiddleware);

if (!isEmpty(process.env.ROUTER_ROOT)) {
    router.setRootPath(process.env.ROUTER_ROOT || '');
}

router.start();

export default router;
