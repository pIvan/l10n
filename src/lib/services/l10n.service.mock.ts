import { L10nBaseLoader, IL10nLoaderResponse, IL10nFileRequest } from '@localization/l10n';
import { Observable } from 'rxjs';


export const fileMock = {
    'localization.test.simple': '@localization/l10n',
    'localization.test.interpolation.dollarArgument': '@localization/l10n single brackets with dollar interpolation - ${variable}.',
    'localization.test.interpolation.singleBracketsArgument': '@localization/l10n single brackets interpolation - {variable}.',
    'localization.test.interpolation.doubleBracketsArgument': '@localization/l10n double brackets interpolation - {{variable}}.',
    'localization.test.interpolation.arrayArgument': '@localization/l10n array interpolation - ${0}.',
    'localization.test.interpolation.customInterpolation': '@localization/l10n custom interpolation - %variable%.',
    'localization.test.interpolation.customArrayInterpolation': '@localization/l10n custom array interpolation - [[0]].',
    'localization.test.key.as.value': '{localization.test.simple} is the best localization for Angular!',
    'localization.test.interpolation.mixedMultipleArguments': '@localization/l10n ${variable1}-{variable2}-{{variable3}}'
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