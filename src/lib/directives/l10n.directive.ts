import { Directive, Input, ElementRef, OnInit, SimpleChanges, OnDestroy, OnChanges, Renderer2 } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { L10nService } from './../services/l10n.service';
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

    constructor(
        private _elementRef: ElementRef,
        private _renderer: Renderer2,
        private _l10n: L10nService) {
    }

    public ngOnInit(): void {
        this.subscription = this._l10n.observe(this.localizationKey, this.localizationParams)
            .subscribe((sentence) => this.localizeElement(sentence));
    }

    public ngOnChanges(change: SimpleChanges): void {
        if (change['localizationParams']) {
            if (change['localizationParams'].currentValue &&
                change['localizationParams'].currentValue != change['localizationParams'].previousValue) {
                this.localize(this.localizationKey, change['localizationParams'].currentValue);
            }
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    private localize(localizationKey: string, localizationParams?: any) {
        this.localizeElement(this._l10n.get(localizationKey, localizationParams));
    }

    public localizeElement(localization: string) {
        this._renderer.setProperty(this._elementRef.nativeElement, 'textContent', localization);
    }
}