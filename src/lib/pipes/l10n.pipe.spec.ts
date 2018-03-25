import { Component } from '@angular/core';
import { TestBed, async, inject, fakeAsync, tick, ComponentFixture } from '@angular/core/testing';
import { L10nModule, L10nService, LanguageCodes } from '@localization/l10n';
import { L10nTestLoader, fileMock } from './../services/l10n.service.mock';

@Component({
    template: `
    <div>
        <div id="simpleExampleAttribute">{{ 'localization.test.simple' | l10n }}</div>
        <div id="simpleExampleProperty" [innerText]="'localization.test.simple' | l10n"></div>
        <div id="withObjectAsArgument">{{ 'localization.test.interpolation.dollarArgument' | l10n: objectAsArgument }}</div>
        <div id="withArrayAsArgument">{{ 'localization.test.interpolation.arrayArgument' | l10n: arrayAsArgument }}</div>
        <div id="withJSONAsArgumentAttribute">{{ 'localization.test.interpolation.dollarArgument' | l10n: {'variable': '66'} }}</div>
        <div id="withJSONAsArgumentProperty" [innerText]="'localization.test.interpolation.dollarArgument' | l10n: {'variable': '11'}"></div>
    </div>`
})
class L10nPipeTextComponent {

    public objectAsArgument: { [key:string]: any } = { variable: 67 };
    public arrayAsArgument: Array<any> = ['@l10n'];

    constructor(localization: L10nService){
        localization.setFromObject(fileMock);
    }
}


describe('L10n Directive', () => {
    let componentEl: HTMLElement;
    let component: L10nPipeTextComponent;
    let fixture: ComponentFixture<L10nPipeTextComponent>;

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
                L10nPipeTextComponent
            ]
        })
        .compileComponents()
        .then(() => {
            fixture = TestBed.createComponent(L10nPipeTextComponent);
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
