import { Observable, Observer } from 'rxjs';


export class L10nProperties {

    private blank = /^\s*|\s*$/;
    private comment = /^\s*#|^\s*$/;
    private section = /^\s*\[(.*)\]\s*$/;
    private import = /^\s*@import\s+url\((.*)\)\s*$/i;
    private split = /^([^=\s]*)\s*=\s*(.+)$/; // TODO: escape EOLs with '\'
    private newLines = /[\r\n]+/; // support both unix and windows newline formats.

    /**
     * parse the *.properties file into an associative array
     */
    public parse(rawText: string): Observable<{ key: string; sentence: string }> {
        const entries = rawText
                            .replace(this.blank, '')
                            .split(this.newLines);

        return Observable.create((observer: Observer<{ key: string; sentence: string }>) => {

            // avoid maximum recursion limit for content with many lines.
            while (true) {
                if (!entries.length) {
                    observer.complete();
                    return;
                }

                const line = entries.shift();
                // comment or blank line?
                if (this.comment.test(line)) {
                    continue;
                }

                const tmp = line.match(this.split);
                if (tmp && tmp.length === 3) {
                    observer.next({ key: tmp[1], sentence: tmp[2] });
                }
            }
        });
    }
}