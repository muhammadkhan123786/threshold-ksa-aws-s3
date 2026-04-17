// hooks/usePageStructure.ts
import { useRoute } from 'react-router5';
import { useSelector } from 'react-redux';
import { UserRole } from 'libs/enums';
import { selectUserRole } from './selectors';
import { RouteNames } from './enum';
import pageRoutes from './pageRoutes';
import { AuthLayout } from 'layout';
import { LoaderPage } from 'pages/loader';
import { Forbidden } from 'pages/forbidden';

export const usePageStructure = () => {
    const { route } = useRoute();
    const userRole: UserRole | undefined = useSelector(selectUserRole);

    if (!route) {
        return { Layout: AuthLayout, Page: LoaderPage };
    }

    const routeName = route.name as RouteNames;

    const pageRoute = pageRoutes[routeName];

    if (!pageRoute) {
        return { Layout: AuthLayout, Page: Forbidden };
    }

    if (pageRoute.isAuthPage) {
        return { Layout: pageRoute.Layout, Page: pageRoute.Page };
    }

    // Handle unauthorized state with Forbidden page
    if (!userRole || !pageRoute.allowedRoles.includes(userRole)) {
        return { Layout: pageRoute.Layout, Page: Forbidden };
    }

    return pageRoute;
};
