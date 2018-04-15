

export interface IL10nConfig {
    defaultLanguage?: string;
    bindingProperty?: string;
}


export class L10nConfig implements IL10nConfig {
    public defaultLanguage: string = null;
    /**
     * used within the directive as a value that will be localized
     * default value for HTML is textContent
     * for NativeScript property text can be defined instead
     */
    public bindingProperty: string = 'textContent';
}