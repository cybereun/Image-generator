
import React from 'react';

interface HeaderProps {
    onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
    return (
        <header className="bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 shadow-lg shadow-indigo-900/10 border-b border-gray-800">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                {/* Spacer for centering logic */}
                <div className="w-10"></div>
                
                <div className="text-center">
                    <h1 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                        Gemini 이미지 생성기 (Pro)
                    </h1>
                    <p className="text-[10px] md:text-xs text-gray-500 font-medium tracking-wider uppercase">gemini-3-pro-image-preview</p>
                </div>

                <button 
                    onClick={onOpenSettings}
                    className="p-2 text-gray-400 hover:text-indigo-400 hover:bg-gray-800 rounded-full transition-all duration-200 group relative"
                    title="API 키 설정"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 group-hover:rotate-90 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="absolute top-12 right-0 bg-gray-800 text-xs text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-gray-700">
                        API 키 변경
                    </span>
                </button>
            </div>
        </header>
    );
};
