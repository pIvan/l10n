import { Injectable } from '@angular/core';
import { L10nProperties } from './../helpers/l10n-properties.class';
import { L10nPo } from './../helpers/l10n-po.class';
import { L10nJSON } from './../helpers/l10n-json.class';
import { Observable } from 'rxjs/Observable';


export abstract class L10nBaseParser {
    public abstract parse(response: any, fileType: string): Observable<{ key: string; sentence: string }>;
}


@Injectable()
export class L10nParser extends L10nBaseParser {

    private _properties: L10nProperties = new L10nProperties();

    private _po: L10nPo = new L10nPo();

    private _json: L10nJSON = new L10nJSON();

    public parse(response: any, fileType: string): Observable<{ key: string; sentence: string }> {
        if (fileType == 'properties') {
            return this.parseProperties(response);
        }
        else if (fileType == 'po') {
            return this.parsePo(response);
        }
        else if (fileType == 'json') {
            return this.parseJSON(response);
        }
        else {
            // return Observable.
            throw Error(`Unknown file type`);
        }
    }

    /**
     * parse the *.properties file into an associative array
     * @param {String} rawText
     */
    private parseProperties(rawText: string, ): Observable<{ key: string; sentence: string }> {
        return this._properties.parse(rawText);
    }

    /**
     * parse the *.po file into an associative array
     * @param {String} rawText
     */
    private parsePo(rawText: string): Observable<{ key: string; sentence: string }> {
        return this._po.parse(rawText);
    }

    /**
     * parse the *.json file into an associative array
     * @param {String} rawText
     */
    private parseJSON(json: any): Observable<{ key: string; sentence: string }> {
        return this._json.parse(json);
    }
}