import React from 'react';
import { LoadingState } from 'libs/types';
import * as ImageTheme from './Theme';

interface ImageProps {
    src: string;
    alt: string;
    loading?: LoadingState;
}
export const Image: React.FC<React.ImgHTMLAttributes<HTMLImageElement> & ImageProps> = ({
    loading,
    src,
    alt,
    ...rest
}) => {
    return (
        <ImageTheme.Body {...rest}>
            {LoadingState.Pending === loading ? (
                <img src="placeholder" alt="placeholder" />
            ) : (
                <ImageTheme.Image src={src} alt={alt} />
            )}
        </ImageTheme.Body>
    );
};
