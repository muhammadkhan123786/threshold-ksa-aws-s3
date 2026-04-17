import React from 'react';
import * as RegistrationTheme from './Theme';
import { useLocales } from 'hooks/locales';

interface AuthBannerProps {}

export const AuthBanner: React.FC<React.HTMLAttributes<HTMLDivElement> & AuthBannerProps> = () => {
    const { trans } = useLocales();

    return (
        <RegistrationTheme.Body>
            <RegistrationTheme.DarkBacklight />
            <RegistrationTheme.BrandLogoWrapper>
                <RegistrationTheme.Logo src="/assets/icons/auth-logo.png" alt="logo" />
                <RegistrationTheme.BrandMessageWrapper>
                    <RegistrationTheme.Quote value='"' variant="span" />
                    <RegistrationTheme.BrandMessage
                        variant="p"
                        value={trans('auth.bannerDescription')}
                    />
                    <RegistrationTheme.Quote value='"' variant="span" right={true} />
                </RegistrationTheme.BrandMessageWrapper>
            </RegistrationTheme.BrandLogoWrapper>
        </RegistrationTheme.Body>
    );
};
