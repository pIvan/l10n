import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { skip } from 'rxjs/operators';

import { L10nModule, L10nService, LanguageCodes } from '@iplab/ngx-l10n';
import { L10nTestLoader, fileMock } from './l10n.service.mock';

describe('L10n Service', () => {

    let service: L10nService;

    beforeEach(async(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [
                L10nModule.forRoot({
                    config: { defaultLanguage: 'en' },
                    loader: L10nTestLoader
                })
            ]
        });

        service = TestBed.get(L10nService);
    }));

    it('should be defined', async(() => {
        expect(service).toBeDefined();
        expect(service instanceof L10nService).toBe(true);
    }));

    it('should load correct localization file', () => {
        spyOn(service, 'setFromFile');
        const testUrl = 'locales/second-locale.properties';

        service.setFromFile( testUrl );

        expect(service.setFromFile).toHaveBeenCalled();
        expect(service.setFromFile).toHaveBeenCalledWith(testUrl);
    });


    it('should notify language changed', (done) => {
        service.languageChanges.subscribe(({ language }) => {
            expect( language ).toBe(LanguageCodes.EnglishUnitedStates);
            done();
        })
        service.language = LanguageCodes.EnglishUnitedStates;
    });

    it('should notify if dictionary is ready', (done) => {
        service.dictionaryReady.subscribe(() => {
            expect( service.get('localization.test.simple') ).toEqual(fileMock['localization.test.simple']);
            done();
        });

        service.setFromFile( 'src/fileMock' );
    });

    it('should set dictionary from object', (done) => {
        service.dictionaryReady.subscribe(() => {
            expect( service.get('localization.test.simple') ).toEqual( fileMock['localization.test.simple'] );
            done();
        });

        service.setFromObject( fileMock );
    });

    it('should return key as falback if key doesn\'t exist in dictionary', () => {
        service.setFromObject( fileMock );

        const testString = service.get('localization.test.foo');
        expect(testString).toEqual('localization.test.foo');
    });

    it('should return correct string from dictionary', fakeAsync((done) => {
        service.setFromFile( 'src/fileMock' );
        const testString = service.get('localization.test.simple');
        expect(testString).toEqual( fileMock['localization.test.simple'] );
    }));

    it('should return fallback sentence if the key is not in the dictionary', () => { 
        const testString = service.get('localization.test.foo', null, 'fallback');
        expect(testString).toEqual('fallback');
    });

   it('should insert correct arguments', fakeAsync(() => {
        service.setFromObject( fileMock );
        tick();

        const dollarArgument = service.get('localization.test.interpolation.dollarArgument', { variable: 1 });
        const singleBracketsArgument = service.get('localization.test.interpolation.singleBracketsArgument', { variable: 1 });
        const doubleBracketsArgument = service.get('localization.test.interpolation.doubleBracketsArgument', { variable: 1 });
        const arrayArgument = service.get('localization.test.interpolation.arrayArgument', [2, 3]);
        const mixedMultipleArguments = service.get('localization.test.interpolation.mixedMultipleArguments', { variable1: 10, variable2: 20, variable3: 30 });
        const keyAsArgument = service.get('localization.test.key.as.value');

        expect(dollarArgument).toEqual('@iplab/ngx-l10n single brackets with dollar interpolation - 1.');
        expect(singleBracketsArgument).toEqual('@iplab/ngx-l10n single brackets interpolation - 1.');
        expect(doubleBracketsArgument).toEqual('@iplab/ngx-l10n double brackets interpolation - 1.');
        expect(arrayArgument).toEqual('@iplab/ngx-l10n array interpolation - 2.3.');
        expect(mixedMultipleArguments).toEqual('@iplab/ngx-l10n 10-20-30');
        expect(keyAsArgument).toEqual('@iplab/ngx-l10n is the best localization for Angular!');
   }));

    it('should observe key on each change', (done) => {
        // ship first because it's initial value
        service.observe( 'localization.test.interpolation.dollarArgument', {variable: '112'}).pipe(
            skip(1)
        ).subscribe((newValue) => {
            expect( newValue ).toEqual("@iplab/ngx-l10n single brackets with dollar interpolation - 112.");
            done();
        });

        service.setFromObject( fileMock );
    });

    it('should manually set a translation value and notify observers about change', () => {
        service.set('localization.test.manually', '@iplab/ngx-l10n - manually set sentence.');
        const sentence = service.get('localization.test.manually');
        expect(sentence).toBe('@iplab/ngx-l10n - manually set sentence.');
    });

});