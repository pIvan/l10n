import { Component } from '@angular/core';
import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { L10nModule, L10nService } from '@iplab/ngx-l10n';
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

    public objectAsArgument: { [key: string]: any } = { variable: 67 };
    public arrayAsArgument: Array<any> = ['@l10n', 2];

    constructor(localization: L10nService) {
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
