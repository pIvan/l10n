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
 * {{}} | {} | ${}
 */
const interpolationRegex: RegExp = /\{\{\s*(.+?)\s*\}\}|\{\s*(.+?)\s*\}|\$\{\s*(.+?)\s*\}/g;


@Injectable()
export class L10nFormatter extends L10nBaseFormatter {

    constructor(private _storage: L10nBaseStorage){
        super();
    }

    public interpolate(sentence: string, args: IL10nArguments): string {
        // match, (...interpolates, offset, string)
        return sentence.replace(interpolationRegex, (match, ...interpolates) => {
            // remove last two elements ( offset, string )
            interpolates.splice(-2);
            interpolates = interpolates.filter((val) => val != null);

            // try to find property in provided arguments
            if (!IsNullOrEmpty(args)) {
                for (let property of interpolates) {
                    let value = args[this.trim(property)];

                    if (!IsNullOrEmpty(value)) {
                        return value;
                    }
                }
            }

            // try to find property in dictionary
            for (let property of interpolates) {
                let sentence = this._storage.getSentance(this.trim(property));

                if (!IsNullOrEmpty(sentence)) {
                    return sentence;
                }
            }

            if (!IsNullOrEmpty(interpolates)) { throw Error(`arguments are not defined in the template or dictionary: ${JSON.stringify(interpolates)}`); }
            return match;
        });
    }
}