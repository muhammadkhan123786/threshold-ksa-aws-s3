import React from 'react';
import { ThreeDots } from 'react-loader-spinner';

export const Loader: React.FC = () => {
    return (
        <div className="flex h-[100px] w-full justify-center text-center mt-[100px]">
            <ThreeDots color="#000" height={50} width={50} />
        </div>
    );
};
