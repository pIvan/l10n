import { Injectable } from '@angular/core';

export abstract class L10nBaseErrorHandler {
    public abstract handleError(error: any): void;
}

@Injectable()
export class L10nErrorHandler extends L10nBaseErrorHandler {

    public handleError(error: Response | string): void {
        let errMsg: string;

        if (error instanceof Response) {
            errMsg = `Lokalization could not find ${error.url} - status: ${error.status} - ${error.statusText || ''}`;
        } else if (typeof error === 'string') {
            errMsg = error;
        }

        throw Error(errMsg);
    }
}