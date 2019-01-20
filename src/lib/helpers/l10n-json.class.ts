import { Observable, Observer } from 'rxjs';

export class L10nJSON {

    /**
     * parse the *.json file into an associative array
     */
    public parse(translations: { [key: string]: string } | string): Observable<{ key: string; sentence: string }> {
        if (typeof translations === 'string') {
            translations = JSON.parse(translations);
        }

        const entries = Object.keys(translations);

        return Observable.create((observer: Observer<{ key: string; sentence: string }>) => {
            while (true) {
                if (!entries.length) {
                    observer.complete();
                    return;
                }

                const key = entries.shift();
                observer.next({ key: key, sentence: translations[key] });
            }
        });
    }

}