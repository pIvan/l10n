import { Injectable } from '@angular/core';
import { L10nBaseStorage } from './l10n-storage.service';
import { IsNullOrEmpty, IL10nArguments } from './../helpers/helpers.class';


export function defineInterpolation(interpolation: [string, string]): RegExp {
    return new RegExp(`\\${interpolation[0].split('').join('\\')}\s*(.+?)\s*\\${interpolation[1].split('').join('\\')}`, 'g');
}

export abstract class L10nBaseFormatter {
    public abstract interpolate(sentence: string, args: IL10nArguments): string;

    /**
     * remove white empty spaces from string beginning and end
     */
    protected trim(property: string | number): string {
        return (property + '').trim();
    }
}

/**
 * regex used for localization interpolation
 * ${} | {{}} | {}
 */
const interpolationRegex: RegExp = /\$\{\s*(.+?)\s*\}|\{\{\s*(.+?)\s*\}\}|\{\s*(.+?)\s*\}/g;

@Injectable()
export class L10nFormatter extends L10nBaseFormatter {

    constructor(private _storage: L10nBaseStorage){
        super();
    }

    public interpolate(sentence: string, args: IL10nArguments): string {
        // match, (...interpolates, offset, string)
        return sentence.replace(interpolationRegex, (match, firstMatch, secondMatch, thirdMatch) => {
            // try to find property in provided arguments
            if (!IsNullOrEmpty(args)) {

                const value = args[this.trim(firstMatch)]
                            || args[this.trim(secondMatch)]
                            || args[this.trim(thirdMatch)];

                if (!IsNullOrEmpty(value)) { return value; }
            }

            // try to find property in dictionary
            const sentenceD = this._storage.getSentance(this.trim(firstMatch))
                            || this._storage.getSentance(this.trim(secondMatch))
                            || this._storage.getSentance(this.trim(thirdMatch));

            if (!IsNullOrEmpty(sentenceD)) { return sentenceD; }

            return match;
        });
    }
}