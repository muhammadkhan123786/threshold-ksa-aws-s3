import React from 'react';
import * as Theme from './Theme';
import { useRouter } from 'react-router5';
import { useSelector } from 'react-redux';
import { BreadcrumbItem, selectBreadcrumbs } from 'store/breadcrumbsSlice';

export const Breadcrumbs: React.FC = () => {
    const items = useSelector(selectBreadcrumbs);
    const router = useRouter();
    const { lang, isRTL } = useSelector<any>((state) => state?.locales) as any;

    const handleOnclickAction = (path: string, params?: Record<string, string>) => {
        if (params) {
            router.navigate(path, params);
        } else {
            router.navigate(path);
        }
    };

    return (
        <Theme.BreadcrumbContainer aria-label="breadcrumb">
            <Theme.BreadcrumbList>
                {items?.map?.((item: BreadcrumbItem, index: number) => (
                    <Theme.BreadcrumbItemWrapper key={index}>
                        {item.path && index !== items.length - 1 ? (
                            <Theme.BreadcrumbLink
                                onClick={() =>
                                    item.path && handleOnclickAction(item.path, item.params)
                                }
                            >
                                {item.label}
                            </Theme.BreadcrumbLink>
                        ) : (
                            <Theme.LastBreadcrumbText>{item.label}</Theme.LastBreadcrumbText>
                        )}
                        {index < items.length - 1 && (
                            <Theme.Separator isRTL={isRTL}>/</Theme.Separator>
                        )}
                    </Theme.BreadcrumbItemWrapper>
                ))}
            </Theme.BreadcrumbList>
        </Theme.BreadcrumbContainer>
    );
};
