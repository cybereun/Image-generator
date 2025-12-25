
import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ModeSelector } from './components/ModeSelector';
import { PromptInput } from './components/PromptInput';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { PromptGuideModal } from './components/PromptGuideModal';
import { EditTechniqueSelector } from './components/EditTechniqueSelector';
import { EditPromptBuilder } from './components/EditPromptBuilder';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { ImageSizeSelector } from './components/ImageSizeSelector';
import { AppMode, EditTechnique, AspectRatio, ImageSize } from './types';
import { generateImage } from './services/geminiService';
import { fileToBase64 } from './utils/fileUtils';
import { EDIT_TECHNIQUES } from './constants';

const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>(AppMode.Generate);
    const [prompt, setPrompt] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
    const [editTechnique, setEditTechnique] = useState<EditTechnique>(EDIT_TECHNIQUES[0].key);
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
    const [imageSize, setImageSize] = useState<ImageSize>('1K');
    
    // API Key State
    const [hasKey, setHasKey] = useState<boolean | null>(null);

    useEffect(() => {
        const checkKey = async () => {
            const selected = await (window as any).aistudio.hasSelectedApiKey();
            setHasKey(selected);
        };
        checkKey();
    }, []);

    const handleSelectKey = async () => {
        await (window as any).aistudio.openSelectKey();
        setHasKey(true);
    };

    const handleFileChange = (file: File | null) => {
        setImageFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    };

    const handleModeChange = (newMode: AppMode) => {
        setMode(newMode);
        setGeneratedImageUrl(null);
        setError(null);
        if (newMode === AppMode.Generate) {
            setPrompt('');
            handleFileChange(null);
        } else {
            setEditTechnique(EDIT_TECHNIQUES[0].key);
        }
    };

    const handleSubmit = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setGeneratedImageUrl(null);

        try {
            let imagePayload: { mimeType: string, data: string } | undefined = undefined;

            if (mode === AppMode.Edit) {
                if (!imageFile) throw new Error('편집 모드에서는 이미지를 업로드해야 합니다.');
                const base64Data = await fileToBase64(imageFile);
                imagePayload = { mimeType: imageFile.type, data: base64Data };
            }

            const resultUrl = await generateImage(
                prompt, 
                imagePayload, 
                mode === AppMode.Generate ? aspectRatio : undefined,
                mode === AppMode.Generate ? imageSize : undefined
            );
            setGeneratedImageUrl(resultUrl);

        } catch (err: any) {
            if (err.message === "REAUTH_NEEDED") {
                setHasKey(false);
                setError("API 키 인증에 실패했습니다. 키를 다시 선택해주세요.");
            } else {
                setError(err instanceof Error ? err.message : '이미지 생성 중 오류가 발생했습니다.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [prompt, mode, imageFile, aspectRatio, imageSize]);

    if (hasKey === false) {
        return (
            <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-gray-800 p-8 rounded-2xl shadow-2xl border border-indigo-500/30 text-center">
                    <div className="w-20 h-20 bg-indigo-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold mb-2">API 키 설정 필요</h2>
                    <p className="text-gray-400 mb-6">
                        고품질 이미지 생성을 위해 유료 GCP 프로젝트의 API 키 선택이 필요합니다. 선택된 키는 로컬 환경에서 안전하게 관리됩니다.
                    </p>
                    <button 
                        onClick={handleSelectKey}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg mb-4"
                    >
                        API 키 선택하기
                    </button>
                    <a 
                        href="https://ai.google.dev/gemini-api/docs/billing" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-indigo-400 hover:text-indigo-300 underline"
                    >
                        결제 및 프로젝트 가이드 확인
                    </a>
                </div>
            </div>
        );
    }

    const selectedTechnique = EDIT_TECHNIQUES.find(t => t.key === editTechnique) ?? EDIT_TECHNIQUES[0];

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
            <Header onOpenSettings={handleSelectKey} />
            <main className="flex-grow container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/3 flex flex-col gap-6">
                    <ModeSelector currentMode={mode} onModeChange={handleModeChange} />
                    
                    {mode === AppMode.Generate && (
                        <div className="space-y-4">
                            <AspectRatioSelector 
                                currentRatio={aspectRatio} 
                                onRatioChange={setAspectRatio} 
                            />
                            <ImageSizeSelector 
                                currentSize={imageSize} 
                                onSizeChange={setImageSize} 
                            />
                        </div>
                    )}

                    {mode === AppMode.Edit && (
                        <>
                            <ImageUploader imagePreview={imagePreview} onFileChange={handleFileChange} />
                            <EditTechniqueSelector currentTechnique={editTechnique} onTechniqueChange={setEditTechnique} />
                            <EditPromptBuilder technique={selectedTechnique} onPromptChange={setPrompt} />
                        </>
                    )}
                    
                    <PromptInput prompt={prompt} setPrompt={setPrompt} onSubmit={handleSubmit} isLoading={isLoading} mode={mode} />

                    <button 
                        onClick={() => setIsGuideOpen(true)}
                        className="mt-4 text-center w-full bg-gray-700 hover:bg-gray-600 text-indigo-300 font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                        프롬프트 가이드 보기
                    </button>
                </div>
                <div className="lg:w-2/3 flex-grow flex items-center justify-center bg-gray-800 rounded-xl shadow-lg p-4">
                    <ResultDisplay imageUrl={generatedImageUrl} isLoading={isLoading} error={error} mode={mode} />
                </div>
            </main>
            <PromptGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
        </div>
    );
};

export default App;
