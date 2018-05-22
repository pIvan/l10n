import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IL10nFileRequest, ResponseType, ContentType } from './../helpers/helpers.class';
import { Observable, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';


export interface IL10nLoaderResponse {
    response: any;
    fileType: string;
}

export abstract class L10nBaseLoader {
    /**
     * map localization urls
     * used to cache url from which we already loaded l10n files (.properties, .po, .json)
     */
    private _loadedUrls: { [key: string]: boolean } = {};

    /**
     * @internal
     * try to get file extension from given url
     * @param url 
     */
    protected getFileExtension(url: string): string {
        return url.split('.').pop();
    }

    public setFromFile(params: IL10nFileRequest): Observable<IL10nLoaderResponse> {
        if (this._loadedUrls[params.url]) {
            return from([]);
        }

        return this.getFile(params).pipe(tap(() => this._loadedUrls[params.url] = true));
    }

    public abstract getFile(params: IL10nFileRequest): Observable<IL10nLoaderResponse>;

    public clear(): void {
        Object.keys(this._loadedUrls).forEach((key: string) => this._loadedUrls[key] = null);
    }
}



@Injectable()
export class L10nLoader extends L10nBaseLoader {

    private responseTypes: { [name: string]: any } = {
        'json': ResponseType.JSON,
        'properties': ResponseType.Text,
        'po': ResponseType.Text
    }

    private contentTypes: { [name: string]: string } = {
        'json': ContentType.JSON,
        'properties': ContentType.Text,
        'po': ContentType.Text
    }

    constructor(private http: HttpClient) {
        super();
    }

    public getFile({ url }: IL10nFileRequest): Observable<IL10nLoaderResponse> {
        let fileType = this.getFileExtension(url);
        let responseType = this.responseTypes[fileType];
        let contentType = this.contentTypes[fileType];

        let headers = new HttpHeaders({ "X-Requested-With": "XMLHttpRequest", "Content-type": contentType });

        return this.http
                .get(url, { headers: headers, responseType: responseType })
                .pipe(map((response) => { return { response, fileType }; }));
    }
}