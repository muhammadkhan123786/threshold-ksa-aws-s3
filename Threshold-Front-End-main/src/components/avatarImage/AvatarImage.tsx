import { calculateYearsDifference } from 'libs/helpers';
import React from 'react';

interface AvatarImageProps {
    avatarUrl?: string;
    date?: string;
}

export const AvatarImage: React.FC<AvatarImageProps> = ({ avatarUrl, date }) => {
    return (
        <div
            style={{
                position: 'relative',
                display: 'inline-block',
                padding: '20px',
                maxWidth: '100%',
            }}
        >
            <img
                src={avatarUrl || '/assets/icons/avatar-image-player.svg'}
                alt="avatar"
                style={{
                    objectFit: 'fill',
                    display: 'block',
                    width: '100%',
                    height: '468px',
                    maxWidth: '424px',
                    maxHeight: '100%',
                    borderRadius: '8px',
                    minWidth: '400px',
                    minHeight: '420px',
                }}
            />
            {avatarUrl && (
                <div
                    style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        color: 'black',
                        opacity: 0.6,
                        fontSize: '180px',
                        fontWeight: '700',
                        padding: '5px 10px',
                        borderRadius: '5px',
                    }}
                >
                    {calculateYearsDifference(new Date(), new Date(date || ''))}
                </div>
            )}
        </div>
    );
};
