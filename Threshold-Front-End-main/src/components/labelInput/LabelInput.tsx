import * as InputTheme from './Theme';
import React from 'react';

interface Props {
    label: string;
}

export const LabelInput: React.FC<Props> = ({ label }) => {
    return <InputTheme.Label>{label}</InputTheme.Label>;
};
