import { Injectable, Inject, Optional } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { L10nBaseLoader } from './l10n-loader.service';
import { L10nBaseStorage } from './l10n-storage.service';
import { L10nBaseParser } from './l10n-parser.service';
import { L10nBaseFormatter } from './l10n-formatter.service';
import { L10nConfig } from './l10n-config.service';
import {
    IsNullOrEmpty,
    IL10nLanguage,
    IL10nDictionary,
    IL10nArguments
} from './../helpers/helpers.class';


@Injectable()
export class L10nService {

    /**
     * ISO Country Codes and ISO Language Code combined to one
     */
    private _language: string = null;

    /**
     * ISO Language Code
     */
    private _languageCode: string = null;

    /**
     * observers for each key in dictionary
     */
    private _observers: { [key: string]: BehaviorSubject<string> } = {};

    private _languageChange: Subject<IL10nLanguage> = new Subject();

    private _dictionaryReady: Subject<{}> = new Subject();

    constructor(
        private _loader: L10nBaseLoader,
        private _storage: L10nBaseStorage,
        private _parser: L10nBaseParser,
        private _formatter: L10nBaseFormatter,
        private _config: L10nConfig) {
        this.initialSettings();
    }

    private initialSettings(): void {
        // initially try to set language
        this.language = this._config.defaultLanguage || this.navigatorLang;
    }

    /**
     * Language changes observer
     */
    public get languageChanges(): Observable<IL10nLanguage> {
        return this._languageChange.asObservable();
    }

    /**
     * when data are loaded, parsed and mapped in dictionary
     * subscribers are notified
     */
    public get dictionaryReady(): Observable<{}> {
        return this._dictionaryReady.asObservable();
    }

    /**
     * clear dictionary cache,
     * set ISO Language code and
     * and notify subscribers about change
     */
    public set language(language: string) {
        // if( this._language == language ){
        //     this.handleError(`trying to set already used language`);
        //     return;
        // }

        this._language = language;
        this._languageCode = language.split('-', 1)[0].toLowerCase();

        this._storage.language = language;

        // notify language changed
        this._languageChange.next({ language: this._language, code: this._languageCode, direction: this.direction });
    }

    /**
     * get ISO Language code
     */
    public get language() {
        return this._language;
    }

    /**
     * get language code
     */
    public get languageCode() {
        return this._languageCode;
    }

    /**
     * get direction (ltr|rtl) of the current language
     * 
     * @example:
     * <html dir="ltr">
     *  ...
     * </html>
     */
    public get direction(): string {
        // http://www.w3.org/International/questions/qa-scripts
        // Arabic, Hebrew, Farsi, Pashto, Urdu
        let rtlList = ['ar', 'he', 'fa', 'ps', 'ur'];
        return (rtlList.indexOf(this._languageCode) != -1) ? 'rtl' : 'ltr';
    }

    /**
     * from storage return maped values as dictionary (maped key => value)
     */
    public get dictionary(): IL10nDictionary {
        return this._storage.dictionary;
    }

    /**
     * in dictionary find value by key and translate it
     * @example
     * dictionary = {
     *  l10n.lang.key1: 'L10n v{{version}} (build: {{build}})', 
     *  l10n.lang.key2: 'L10n v{{0}} (build: {{1}})',
     *  l10n.lang.key3: 'L10n v{version} (build: {build})',
     *  l10n.lang.key4: 'L10n v{0} (build: {1})',
     *  l10n.lang.key5: 'L10n v${version} (build: ${build})',
     *  l10n.lang.key6: 'L10n v${0} (build: ${1})',
     *  l10n.lang.key9: 'L10n',
     *  l10n.lang.key10: '${l10n.lang.key9} is the best localization for Angular'
     * };
     *
     *
     * example 1:
     * l10n.get('l10n.lang.key1', { version: 1.61.00.1, build: 600124 }); =>  L10n v1.61.00.1 (build: 600124)
     * 
     * example 2:
 	 * l10n.get('l10n.lang.key2', [1.61.00.1, 600124]); =>  L10n v1.61.00.1 (build: 600124)
     *
     * example 3:
     * l10n.get('l10n.lang.key3', { version: 1.61.00.1, build: 600124 }); =>  L10n v1.61.00.1 (build: 600124)
     * 
     * example 4:
     * l10n.get('l10n.lang.key4', [1.61.00.1, 600124]); =>  L10n v1.61.00.1 (build: 600124)
     * 
     * example 5:
     * l10n.get('l10n.lang.key5', { version: 1.61.00.1, build: 600124 }); =>  L10n v1.61.00.1 (build: 600124)
     * 
     * example 6:
     * l10n.get('l10n.lang.key6', [1.61.00.1, 600124]); =>  L10n v1.61.00.1 (build: 600124)
     * 
     * example 7:
     * l10n.get('l10n.lang.key7'); => l10n.lang.key7
     *
     * example 8:
     * l10n.get('l10n.lang.key7', null, 'Return this if you can't find key in dictionary'); => Return this if you can't find key in dictionary
     * 
     * example 9:
     * l10n.get('l10n.lang.key10'); => L10n is the best localization for Angular
     */
    public get(key: string, args?: IL10nArguments | string, fallbackString?: string): string {
        return this.fromDictionary(key, args, fallbackString);
    }

    /**
     * observe key change in dictionary and return translation
     */
    public observe(key: string, args?: IL10nArguments | string, fallbackString?: string): Observable<string> {
        if (!this._observers[key]) {
            this._observers[key] = new BehaviorSubject(key);
        }

        return this._observers[key].map((key) => this.fromDictionary(key, args, fallbackString));
    }

    /**
     * Manually set a translation value and notify observers about change
     */
    public set(key: string, sentence: string): void {
        this.addToDictionary(key, sentence);
    }

    /**
     * return value from dictionray by specific key
     * or return callback string
     */
    private fromDictionary(key: string, args: IL10nArguments | string, fallback?: string): string {
        let sentence = this._storage.getSentance(key);
        let interpolateArguments = this.prepareArguments(args);

        if (sentence) {
            sentence = this.evaluate(sentence, interpolateArguments);
        }

        return this.fallbackCheck(sentence, fallback, key);
    }

    /**
     * prepare arguments to use them in translation
     * accepted Object, Array or JSON object writen in template
     */
    private prepareArguments(args: any): IL10nArguments {
        // we should accept JSON object writen in template
        if (typeof args == 'string' && !IsNullOrEmpty(args)) {
            let validArgs: string = args.replace(/(\')?([a-zA-Z0-9_]+)(\')?(\s)?:/g, '"$2":')
                .replace(/:(\s)?(\')(.*?)(\')/g, ':"$3"');

            try {
                return JSON.parse(validArgs);
            }
            catch (e) {
                throw new SyntaxError(`Wrong parameter. Expected a valid Object or Array, received: ${args}`);
            }
        }

        return args;
    }

    /**
     * replace expressions with values
     * all value holders should be replaced with values and return prepared string
     * 
     * known interpolations
     * {{}} | {} | ${}
     */
    private evaluate(sentence: string, args: IL10nArguments): string {
        return this._formatter.interpolate(sentence, args);
    }

    /**
     * @description 
     * check given values and if there is no sentence 
     * return fallback string, otherwise return given key value
     */
    private fallbackCheck(sentence: string, fallback: string, key: string): string {
        if (!IsNullOrEmpty(sentence)) {
            return sentence;
        }

        if (!IsNullOrEmpty(fallback)) {
            return fallback;
        }

        // if you can't find key in dictionary return it as fallback
        return key;
    }

    /**
     * set a translation value in storage and notify observers about change
     */
    private addToDictionary(key: string, value: string) {

        if (IsNullOrEmpty(key) && IsNullOrEmpty(value)) {
            this.handleError(`To manually set translation you need to define key and sentence!`);
            return;
        }

        let oldVal = this._storage.getSentance(key);
        let newVal = this.evalString(value);

        // if old value has beed changed
        // or if it was undefined then we need to trigger change on this key
        if (newVal !== oldVal) {
            this._storage.setSentence(key, newVal);

            if (this._observers[key]) {
                this._observers[key].next(key);
            }
        }
    }

    /**
     * handle escaped characters (backslashes) in a string
     */
    private evalString(text: string): string {
        if (text.lastIndexOf('\\') < 0)
            return text;

        return text.replace(/\\\\/g, '\\')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\b/g, '\b')
            .replace(/\\f/g, '\f')
            .replace(/\\{/g, '{')
            .replace(/\\}/g, '}')
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");
    }

    /**
     * used only in browsers, 
     * try to manually get default language
     */
    private get navigatorLang(): string {
        if (typeof window == null && typeof window.navigator == null) {
            return null;
        }

        let navigator = window.navigator;

        return navigator ?
            navigator.language ||
            // IE 10 in IE8 mode on Windows 7 uses upper-case in
            // navigator.userLanguage country codes but per
            // http://msdn.microsoft.com/en-us/library/ie/ms533052.aspx (via
            // http://msdn.microsoft.com/en-us/library/ie/ms534713.aspx), they
            // appear to be in lower case, so we bring them into harmony with navigator.language.
            ((<any>navigator).userLanguage && (<any>navigator).userLanguage.replace(/-[a-z]{2}$/, String.prototype.toUpperCase)) ||
            (<any>navigator).browserLanguage ||
            (<any>navigator).systemLanguage
            :
            null;
    }

    /**
     * clear all data from memory if exist there
     * also we need to clear mapped urls
     */
    public clear(): void {
        this._storage.clear();
        this._loader.clear();
    }

    /**
     * set localization from JavaScript object
     * it's merged with previous one unless otherwise is defined
     */
    public setFromObject(translations: { [key: string]: string }, shouldMerge: boolean = true): Observable<{}> {
        if (shouldMerge !== true) {
            this.clear();
        }

        return this.parse(new Subject(), translations, 'json');
    }

    /**
     * set localization from files like
     * .properties,
     * .json,
     * .po
     * each response is merged with previous one
     * unless otherwise is defined
     */
    public setFromFile(url: string, shouldMerge: boolean = true): Observable<{}> {
        if (shouldMerge !== true) {
            this.clear();
        }

        const subject = new Subject();
        let loading = true;

        this._loader
            .setFromFile({ url, language: this._language, code: this._languageCode, direction: this.direction })
            .subscribe(({ response, fileType }) => {
                this.parse(subject, response, fileType);
                loading = false;
            },
                (error: Response) => this.handleError(error),
                () => loading ? this.forceChange() : null);

        return subject.asObservable();
    }

    /**
     * parse data and set to dictionary
     */
    private parse(subject: Subject<{}>, data: any, fileType: string): Observable<{}> {
        this._parser
            .parse(data, fileType)
            .subscribe(
                ({ key, sentence }) => this.addToDictionary(key, sentence),
                (error) => this.handleError(error),
                () => {
                    this._dictionaryReady.next();
                    subject.next();
                    subject.complete();
                }
            );
        return subject.asObservable();
    }

    /**
     * @internal
     * if file isn't loaded and values are already in dictionary
     * trigger change on each observer
     */
    private forceChange(): void {
        Object.keys(this._observers).forEach((key) => this._observers[key].next(key));
    }

    /**
     * @internal
     */
    private handleError(error: Response | string): void | Promise<any> {
        let errMsg: string;

        if (error instanceof Response) {
            errMsg = `Lokalization could not find ${error.url} - status: ${error.status} - ${error.statusText || ''}`;

            return Promise.reject(errMsg);
        } else {
            errMsg = error;
        }

        throw Error(errMsg);
    }
}