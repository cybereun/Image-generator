import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
    currentRatio: AspectRatio;
    onRatioChange: (ratio: AspectRatio) => void;
}

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ currentRatio, onRatioChange }) => {
    const ratios: AspectRatio[] = ['1:1', '16:9', '9:16', '4:3', '3:4'];
    
    const baseClasses = "flex-1 py-2 px-1 rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 text-center";
    const activeClasses = "bg-indigo-600 text-white shadow";
    const inactiveClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";

    return (
        <div className="flex flex-col gap-2">
             <p className="text-sm font-semibold text-gray-400 mb-1">이미지 비율 (Aspect Ratio):</p>
            <div className="flex gap-2">
                {ratios.map((ratio) => (
                    <button
                        key={ratio}
                        onClick={() => onRatioChange(ratio)}
                        className={`${baseClasses} ${currentRatio === ratio ? activeClasses : inactiveClasses}`}
                        aria-pressed={currentRatio === ratio}
                    >
                        {ratio}
                    </button>
                ))}
            </div>
        </div>
    );
};