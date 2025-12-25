
import { GoogleGenAI, Modality, GenerateContentResponse, Content, Part } from "@google/genai";
import { AspectRatio, ImageSize } from "../types";

// Always create a new instance before making an API call to ensure up-to-date API key usage
const getAIClient = () => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        throw new Error("API 키가 설정되지 않았습니다. API 키를 먼저 선택해주세요.");
    }
    return new GoogleGenAI({ apiKey });
};

const MODEL_NAME = 'gemini-3-pro-image-preview';

export const generateImage = async (
    prompt: string,
    image?: { mimeType: string; data: string },
    aspectRatio?: AspectRatio,
    imageSize?: ImageSize
): Promise<string> => {
    
    if (!prompt) {
        throw new Error("프롬프트는 비워둘 수 없습니다.");
    }

    const ai = getAIClient();
    const textPart: Part = { text: prompt };
    const parts: Part[] = [textPart];

    if (image) {
        const imagePart: Part = {
            inlineData: {
                mimeType: image.mimeType,
                data: image.data,
            },
        };
        parts.unshift(imagePart);
    }
    
    const contents: Content[] = [{ parts }];

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: MODEL_NAME,
            contents,
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
                imageConfig: (aspectRatio || imageSize) ? { 
                    aspectRatio,
                    imageSize 
                } : undefined,
                tools: [{ googleSearch: {} }] // Gemini 3 Pro supports Search Grounding for real-time info
            },
        });
        
        // Handle potential error from the model response
        if (response.candidates && response.candidates.length > 0) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    const base64ImageBytes: string = part.inlineData.data;
                    return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                }
            }
        }

        const textResponse = response.text?.trim();
        if (textResponse) {
             throw new Error(`모델이 이미지를 생성하지 않았습니다: ${textResponse}`);
        }

        throw new Error("생성된 이미지를 찾을 수 없습니다.");

    } catch (error: any) {
        console.error("Gemini API Error:", error);
        
        // Handle specific re-authentication error
        if (error.message?.includes("Requested entity was not found")) {
            throw new Error("REAUTH_NEEDED");
        }
        
        if (error.message?.includes('429')) {
             throw new Error("요청이 너무 많습니다. 잠시 후 다시 시도해주세요.");
        }
        throw new Error(`API 요청 실패: ${error instanceof Error ? error.message : String(error)}`);
    }
};
