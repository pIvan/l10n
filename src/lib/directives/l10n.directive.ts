import { Directive, Input, ElementRef, OnInit, SimpleChanges, OnDestroy, OnChanges, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs';
import { L10nService } from './../services/l10n.service';
import { L10nConfig } from './../services/l10n-config.service';
import { IL10nArguments } from './../helpers/helpers.class';

/** 
 * @example
 * l10n="l10n.lang.key1"
 * [l10n-args]="Object | Array | JSON"
 */
@Directive({ selector: '[l10n]' })
export class L10nDirective implements OnInit, OnDestroy, OnChanges {

    @Input('l10n')
    private localizationKey: string;

    @Input('l10n-args')
    private localizationParams: IL10nArguments | string;

    private subscription: Subscription;

    /**
     * TODO -> add dot selector
     * [l10n.propertyName] ili l10n.propertyName
     * https://github.com/angular/angular/issues/13355
     * [l10n.title], [l10n.alt], [l10n.innerText], [l10n.textContent]
     */
    constructor(
        private _config: L10nConfig,
        private _elementRef: ElementRef,
        private _renderer: Renderer2,
        private _l10n: L10nService) {
    }

    public ngOnInit(): void {
        this.subscription = this._l10n.observe(this.localizationKey, this.localizationParams)
            .subscribe((sentence) => this.localizeElement(sentence));
    }

    public ngOnChanges(change: SimpleChanges): void {
        const params = change['localizationParams'];
        if (params && params.currentValue && params.currentValue != params.previousValue) {
            this.localize(this.localizationKey, change['localizationParams'].currentValue);
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private localize(localizationKey: string, localizationParams?: any) {
        this.localizeElement(this._l10n.get(localizationKey, localizationParams));
    }

    public localizeElement(localization: string) {
        this._renderer.setProperty(this._elementRef.nativeElement, this._config.bindingProperty, localization);
    }
}