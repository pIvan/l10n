import { Injectable } from '@angular/core';
import { L10nBaseStorage } from '@localization/l10n';


@Injectable()
export class AppLocalizationStorageService extends L10nBaseStorage {

    public getSentance( key: string ): string {
        return this._dictionary[this._language] ? this._dictionary[this._language][key] : null;
    }

    public setSentence( key: string, sentence: string ): void {
        if(!this._dictionary[this._language]){
            this._dictionary[this._language] = {};
        }

        this._dictionary[this._language][ key ] = sentence;
    }
}