import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { L10nModule, L10nService } from '@iplab/ngx-l10n';
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

    public objectAsArgument: { [key: string]: any } = { variable: 67 };
    public arrayAsArgument: Array<any> = ['@l10n', 2];

    constructor(localization: L10nService){
        localization.setFromObject(fileMock);
    }
}


describe('L10n Pipe', () => {
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
        const simpleExampleAttribute = componentEl.querySelector('#simpleExampleAttribute').textContent;
        const simpleExampleProperty = componentEl.querySelector('#simpleExampleProperty').textContent;
        expect(simpleExampleAttribute).toEqual(fileMock['localization.test.simple']);
        expect(simpleExampleProperty).toEqual(fileMock['localization.test.simple']);
    }));

    it(`should render translation with bind arguments`, async(() => {
        const withObjectAsArgument = componentEl.querySelector('#withObjectAsArgument').textContent;
        const withArrayAsArgument = componentEl.querySelector('#withArrayAsArgument').textContent;
        expect(withObjectAsArgument).toEqual('@iplab/ngx-l10n single brackets with dollar interpolation - 67.');
        expect(withArrayAsArgument).toEqual('@iplab/ngx-l10n array interpolation - @l10n.2.');
    }));

    it(`should render translation with JSON arguments`, async(() => {
        const withJSONAsArgumentAttribute = componentEl.querySelector('#withJSONAsArgumentAttribute').textContent;
        const withJSONAsArgumentProperty = componentEl.querySelector('#withJSONAsArgumentProperty').textContent;
        expect(withJSONAsArgumentAttribute).toEqual('@iplab/ngx-l10n single brackets with dollar interpolation - 66.');
        expect(withJSONAsArgumentProperty).toEqual('@iplab/ngx-l10n single brackets with dollar interpolation - 11.');
    }));

});
