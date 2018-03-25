import { Component } from '@angular/core';
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { L10nModule, L10nService, LanguageCodes } from '@localization/l10n';
import { L10nTestLoader, fileMock } from './../services/l10n.service.mock';

@Component({
    template: `
    <div>
        <div id="simpleExampleAttribute" l10n="localization.test.simple"></div>
        <div id="simpleExampleProperty" [l10n]="'localization.test.simple'"></div>
        <div id="withObjectAsArgument" l10n="localization.test.interpolation.dollarArgument" [l10n-args]="objectAsArgument"></div>
        <div id="withArrayAsArgument" l10n="localization.test.interpolation.arrayArgument" [l10n-args]="arrayAsArgument"></div>
        <div id="withJSONAsArgumentAttribute" l10n="localization.test.interpolation.dollarArgument" l10n-args="{variable: '66'}"></div>
        <div id="withJSONAsArgumentProperty" l10n="localization.test.interpolation.dollarArgument" [l10n-args]="{variable: 11}"></div>
    </div>`
})
class L10nDirectiveTextComponent {

    public objectAsArgument: { [key:string]: any } = { variable: 67 };
    public arrayAsArgument: Array<any> = ['@l10n'];

    constructor(localization: L10nService){
        localization.setFromObject(fileMock);
    }
}


describe('L10n Directive', () => {
    let componentEl: HTMLElement;
    let component: L10nDirectiveTextComponent;
    let fixture: ComponentFixture<L10nDirectiveTextComponent>;

    beforeEach(async(() => {
        TestBed.resetTestingModule();

        TestBed.configureTestingModule({
            imports: [
                L10nModule.forRoot({
                    config: { defaultLanguage: 'en' },
                    loader: L10nTestLoader
                })
            ],
            declarations: [
                L10nDirectiveTextComponent
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(L10nDirectiveTextComponent);
            component = fixture.componentInstance;
            componentEl = fixture.debugElement.nativeElement;
            fixture.detectChanges();
        });

    }));

    it('should create the component', async(() => {
        expect(component).toBeTruthy();
    }));

    it(`should render simple translation`, async(() => {
        let simpleExampleAttribute = componentEl.querySelector('#simpleExampleAttribute').textContent;
        let simpleExampleProperty = componentEl.querySelector('#simpleExampleProperty').textContent;
        expect(simpleExampleAttribute).toEqual(fileMock['localization.test.simple']);
        expect(simpleExampleProperty).toEqual(fileMock['localization.test.simple']);
    }));

    it(`should render translation with bind arguments`, async(() => {
        let withObjectAsArgument = componentEl.querySelector('#withObjectAsArgument').textContent;
        let withArrayAsArgument = componentEl.querySelector('#withArrayAsArgument').textContent;
        expect(withObjectAsArgument).toEqual('@localization/l10n single brackets with dollar interpolation - 67.');
        expect(withArrayAsArgument).toEqual('@localization/l10n array interpolation - @l10n.');
    }));

    it(`should render translation with JSON arguments`, async(() => {
        let withJSONAsArgumentAttribute = componentEl.querySelector('#withJSONAsArgumentAttribute').textContent;
        let withJSONAsArgumentProperty = componentEl.querySelector('#withJSONAsArgumentProperty').textContent;
        expect(withJSONAsArgumentAttribute).toEqual('@localization/l10n single brackets with dollar interpolation - 66.');
        expect(withJSONAsArgumentProperty).toEqual('@localization/l10n single brackets with dollar interpolation - 11.');
    }));

});
