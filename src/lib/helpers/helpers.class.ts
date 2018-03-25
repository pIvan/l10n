
export function IsNullOrEmpty(value: any): boolean {
    return value == null || value.length === 0;
}

/**
 * L10n use structure
 * key: sentence
 * 
 * but how we use storage service, you can map it how you want
 * language:
 *  key: sentence
 */
export interface IL10nDictionary {
    [key: string]: string | { [key: string]: string };
}

export interface IL10nLanguage {
    language: string;
    code: string;
    direction: string;
}

export class ResponseType {
    public static ArrayBuffer: 'arraybuffer' = 'arraybuffer';
    public static Blob: 'blob' = 'blob';
    public static Document: 'document' = 'document';
    public static JSON: 'json' = 'json';
    public static Text: 'text' = 'text';
}

export class ContentType {
    public static Document = 'text/html; charset=UTF-8';
    public static Text = 'text/plain; charset=UTF-8';
    public static JSON = 'application/json; charset=UTF-8';
}

export interface IL10nFileRequest {
    language: string;
    code: string;
    direction: string;
    url: string;
}

export type IL10nArguments = { [key: string]: number } | { [key: string]: string } | string[] | number[];