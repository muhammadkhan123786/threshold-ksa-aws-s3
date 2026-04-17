import React from 'react';
import * as LinkTheme from './Theme';

interface LinkProps {
    href: string;
    text: string;
}

export const Link: React.FC<React.HTMLAttributes<HTMLAnchorElement> & LinkProps> = ({
    href,
    text,
    ...rest
}) => {
    return (
        <LinkTheme.Link href={href} {...rest}>
            {text}
        </LinkTheme.Link>
    );
};
