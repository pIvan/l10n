import { L10nBaseLoader, IL10nLoaderResponse, IL10nFileRequest } from '@iplab/ngx-l10n';
import { Observable } from 'rxjs';


export const fileMock = {
    'localization.test.simple': '@iplab/ngx-l10n',
    'localization.test.interpolation.dollarArgument': '@iplab/ngx-l10n single brackets with dollar interpolation - ${variable}.',
    'localization.test.interpolation.singleBracketsArgument': '@iplab/ngx-l10n single brackets interpolation - {variable}.',
    'localization.test.interpolation.doubleBracketsArgument': '@iplab/ngx-l10n double brackets interpolation - {{variable}}.',
    'localization.test.interpolation.arrayArgument': '@iplab/ngx-l10n array interpolation - ${0}.${1}.',
    'localization.test.interpolation.customInterpolation': '@iplab/ngx-l10n custom interpolation - %variable%.',
    'localization.test.interpolation.customArrayInterpolation': '@iplab/ngx-l10n custom array interpolation - [[0]].',
    'localization.test.key.as.value': '{localization.test.simple} is the best localization for Angular!',
    'localization.test.interpolation.mixedMultipleArguments': '@iplab/ngx-l10n ${variable1}-{variable2}-{{variable3}}'
}


/**
 * Loader mock class
 */
export class L10nTestLoader extends L10nBaseLoader {

    constructor(){
        super();
    }

    public getFile({ url }: IL10nFileRequest): Observable<IL10nLoaderResponse> {
        return Observable.create(( observer ) => {
            observer.next({ response: fileMock, fileType: 'json' });
            observer.complete();
        });
    }
}