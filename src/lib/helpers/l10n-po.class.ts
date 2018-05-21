import { Observable, Observer } from 'rxjs';


// #: (reference)
// # or #@ or #. (comment)
// #, fuzzy (fuzzy flag)
// msgctxt
// msgid
// msgid_plural
// msgstr

/**
 * currently works without plural
 */
export class L10nPo {

    private blank = /^\s*|\s*$/;
    private newLines = /[\r\n]+/; // support both unix and windows newline formats.

    /**
     * parse the *.po file into an associative array
     */
    public parse(rawText: string): Observable<{ key: string; sentence: string }> {
        let entries = rawText
            .replace(this.blank, '')
            .split(this.newLines);

        return Observable.create((observer: Observer<{ key: string; sentence: string }>) => {
            let itemKey = null;

            // avoid maximum recursion limit for content with many lines.
            while (true) {
                if (!entries.length) {
                    observer.complete();
                    return;
                }

                let line = entries.shift();

                if (line.match(/^msgid/)) { // key
                    itemKey = this.extract(line);
                }

                if (line.match(/^msgstr/) && itemKey) { // Translation
                    observer.next({ key: itemKey, sentence: this.extract(line) });
                    itemKey = null;
                }
            }
        });
    }

    private extract(text: string): string {
        return text.replace(this.blank, '')
            .replace(/^[^"]*"|"$/g, '')
            .replace(/\\([abtnvfr'"\\?]|([0-7]{3})|x([0-9a-fA-F]{2}))/g, function (match, esc, oct, hex) {
                if (oct) {
                    return String.fromCharCode(parseInt(oct, 8));
                }
                if (hex) {
                    return String.fromCharCode(parseInt(hex, 16));
                }
                switch (esc) {
                    case 'a':
                        return '\x07';
                    case 'b':
                        return '\b';
                    case 't':
                        return '\t';
                    case 'n':
                        return '\n';
                    case 'v':
                        return '\v';
                    case 'f':
                        return '\f';
                    case 'r':
                        return '\r';
                    default:
                        return esc;
                }
            });
    }

}