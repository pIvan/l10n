import { Injectable } from '@angular/core';
import { IL10nDictionary } from './../helpers/helpers.class';


export abstract class L10nBaseStorage {

    /**
     * ISO Country Codes and ISO Language Code combined to one
     */
    protected _language: string = null;

    /**
     * map localization as key => value
     */
    protected _dictionary: IL10nDictionary = {};

    /**
     * returns dictionray (maped key => value)
     */
    public get dictionary(): IL10nDictionary {
        return this._dictionary;
    }

    public set dictionary(dictionary: IL10nDictionary) {
        this._dictionary = dictionary;
    }

    public abstract getSentance(key: string): string;

    public abstract setSentence(key: string, sentence: string): void;

    /**
     * set ISO Language code
     * eventualy used to map values as [language][key] => sentence
     */
    public set language(language: string) {
        this._language = language;
    }

    public clear(): void {
        Object.keys(this._dictionary).forEach((key: string) => this._dictionary[key] = null);
    }
}


@Injectable()
export class L10nStorage extends L10nBaseStorage {

    public getSentance(key: string): string {
        return <string>this._dictionary[key];
    }

    public setSentence(key: string, sentence: string): void {
        this._dictionary[key] = sentence;
    }
}