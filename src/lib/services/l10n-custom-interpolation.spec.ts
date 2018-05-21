import { Injectable } from '@angular/core';
import { TestBed, async, inject, fakeAsync, tick } from '@angular/core/testing';
import { L10nModule, L10nService, L10nBaseFormatter, defineInterpolation, L10nBaseStorage, IL10nArguments } from '@localization/l10n';
import { IsNullOrEmpty } from './../helpers/helpers.class';
import { L10nTestLoader, fileMock } from './l10n.service.mock';





describe('L10n Config', () => {

    let counter = 0; // used to count tests
    let interpolations: Array<[string, string]> = [
        ['%', '%'],
        ['[[', ']]']
    ];
    let interpolationRegex: RegExp = null;

    @Injectable()
    class L10nTestFormatter extends L10nBaseFormatter {

        constructor(private _storage: L10nBaseStorage){
            super();
        }
    
        public interpolate(sentence: string, args: IL10nArguments): string {
            return sentence.replace(interpolationRegex, (match, interpolates) => {    
                if (!IsNullOrEmpty(args)) {
                    return args[this.trim(interpolates)];
                }
    
                return match;
            });
        }
    }

    
    let service: L10nService;

    beforeEach(async(() => {
        TestBed.resetTestingModule();

        interpolationRegex = defineInterpolation(interpolations[counter]);

        TestBed.configureTestingModule({
            imports: [
                L10nModule.forRoot({
                    config: { defaultLanguage: 'en' },
                    loader: L10nTestLoader,
                    formatter: L10nTestFormatter
                })
            ]
        });

        service = TestBed.get(L10nService);
    }));

    afterEach(() => {
        counter++;
    })
    
   it('should insert correct arguments with custom interpolation (%value%)', fakeAsync(() => {
        service.setFromObject( fileMock );
        tick();
        let customInterpolation = service.get('localization.test.interpolation.customInterpolation', {variable:3});
        expect(customInterpolation).toEqual('@localization/l10n custom interpolation - 3.');
    }));

   it('should insert correct arguments with custom interpolation ([[value]])', fakeAsync(() => {
        service.setFromObject( fileMock );
        tick();
        let customArrayInterpolation = service.get('localization.test.interpolation.customArrayInterpolation', [12]);
        expect(customArrayInterpolation).toEqual('@localization/l10n custom array interpolation - 12.');
    }));

});