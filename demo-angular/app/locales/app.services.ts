import { Injectable } from "@angular/core";
import { 
    IL10nLoaderResponse, 
    IL10nFileRequest, 
    L10nBaseLoader,
    L10nBaseStorage,
    L10nBaseParser,
    L10nBaseFormatter,
    L10nBaseErrorHandler,
    LanguageCodes,
    L10nService
} from '@localization/l10n';
import { knownFolders } from "file-system";
import { Subject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resolve } from "@angular/router";

@Injectable()
export class LocalizationResolve implements Resolve<any> {

    constructor(private localization: L10nService){
        this.localization.languageChanges.subscribe(({ code }) => {
            this.localization.setFromFile(`${code}.locales.properties`);
        })
    }

    public resolve(): Observable<any>|Promise<any> {
        return this.localization.setFromFile(`${this.localization.languageCode}.locales.properties`);
    }
}


@Injectable()
export class CustomLoader extends L10nBaseLoader {

    folderName = 'locales';
    documents = knownFolders.currentApp();
    folder = this.documents.getFolder(this.folderName);

    public getFile({ url, code }: IL10nFileRequest ): Observable<IL10nLoaderResponse> {
        let fileType = this.getFileExtension( url );                           
        let file = this.folder.getFile(url);

        return from(file.readText())
                .pipe(map((response) => {
                    return { response, fileType }
                }));
    }
}