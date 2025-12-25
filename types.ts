export enum AppMode {
    Generate = 'generate',
    Edit = 'edit',
}

export enum EditTechnique {
    AddRemove = 'add-remove',
    Inpaint = 'inpaint',
    StyleTransfer = 'style-transfer',
    Restore = 'restore',
    Colorize = 'colorize',
    Upscale = 'upscale',
}

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

// New types for the interactive prompt builder
export type PromptPart = 
    | { type: 'text'; value: string }
    | { type: 'input'; id: string; placeholder: string; suggestions?: string[] }
    | { type: 'select'; id: string; options: string[] };

export interface EditTechniqueDetails {
    key: EditTechnique;
    label: string;
    parts: PromptPart[];
}