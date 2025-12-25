
import React from 'react';
import { ImageSize } from '../types';

interface ImageSizeSelectorProps {
    currentSize: ImageSize;
    onSizeChange: (size: ImageSize) => void;
}

export const ImageSizeSelector: React.FC<ImageSizeSelectorProps> = ({ currentSize, onSizeChange }) => {
    const sizes: ImageSize[] = ['1K', '2K', '4K'];
    
    const baseClasses = "flex-1 py-2 px-1 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-500 text-center";
    const activeClasses = "bg-cyan-600 text-white shadow";
    const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

    return (
        <div className="flex flex-col gap-2">
             <p className="text-sm font-semibold text-gray-400 mb-1">이미지 품질 (Size):</p>
            <div className="flex gap-2">
                {sizes.map((size) => (
                    <button
                        key={size}
                        onClick={() => onSizeChange(size)}
                        className={`${baseClasses} ${currentSize === size ? activeClasses : inactiveClasses}`}
                        aria-pressed={currentSize === size}
                    >
                        {size}
                    </button>
                ))}
            </div>
        </div>
    );
};
