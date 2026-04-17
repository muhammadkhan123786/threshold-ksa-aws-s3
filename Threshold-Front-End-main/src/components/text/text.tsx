import React from 'react';
import * as TextTheme from './Theme';
import { TextVariant } from 'libs/types';

interface TextControllerProps {
    value: string;
    variant: TextVariant;
    defaultValue?: string;
}

const TextMap = ({ value, ...rest }: { value: string }) => ({
    h1: <TextTheme.Header1Content {...rest}>{value}</TextTheme.Header1Content>,
    h2: <TextTheme.Header2Content {...rest}>{value}</TextTheme.Header2Content>,
    h3: <TextTheme.Header3Content {...rest}>{value}</TextTheme.Header3Content>,
    h4: <TextTheme.Header4Content {...rest}>{value}</TextTheme.Header4Content>,
    h5: <TextTheme.Header5Content {...rest}>{value}</TextTheme.Header5Content>,
    h6: <TextTheme.Header6Content {...rest}>{value}</TextTheme.Header6Content>,
    p: <TextTheme.ParagraphContent {...rest}>{value}</TextTheme.ParagraphContent>,
    span: <TextTheme.SpanContent {...rest}>{value}</TextTheme.SpanContent>,
});

export const Text: React.FC<TextControllerProps & React.HTMLAttributes<HTMLHeadingElement>> = ({
    value,
    variant,
    defaultValue = '',
    ...rest
}) => {
    return TextMap({ value: value || defaultValue, ...rest })[variant];
};
