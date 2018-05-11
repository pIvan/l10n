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

    // notice the double %%, this prints a literal '%' character
    // printf("%%b = '%b'\n", $n); // binary representation
    // printf("%%c = '%c'\n", $c); // print the ascii character, same as chr() function
    // printf("%%d = '%d'\n", $n); // standard integer representation
    // printf("%%e = '%e'\n", $n); // scientific notation
    // printf("%%u = '%u'\n", $n); // unsigned integer representation of a positive integer
    // printf("%%u = '%u'\n", $u); // unsigned integer representation of a negative integer
    // printf("%%f = '%f'\n", $n); // floating point representation
    // printf("%%o = '%o'\n", $n); // octal representation
    // printf("%%s = '%s'\n", $n); // string representation
    // printf("%%x = '%x'\n", $n); // hexadecimal representation (lower-case)
    // printf("%%X = '%X'\n", $n); // hexadecimal representation (upper-case)

    // printf("%%+d = '%+d'\n", $n); // sign specifier on a positive integer
    // printf("%%+d = '%+d'\n", $u); // sign specifier on a negative integer
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