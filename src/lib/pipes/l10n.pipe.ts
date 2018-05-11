import { Pipe, PipeTransform, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { L10nService } from './../services/l10n.service';
import { IsNullOrEmpty } from './../helpers/helpers.class';


/**
 * 
 * dictionary = {
 *  l10n.lang.key1: 'L10n v{{version}} (build: {{build}})', 
 *  l10n.lang.key2: 'L10n v{{0}} (build: {{1}})',
 *  l10n.lang.key3: 'L10n v{version} (build: {build})',
 *  l10n.lang.key4: 'L10n v{0} (build: {1})',
 *  l10n.lang.key5: 'L10n v${version} (build: ${build})',
 *  l10n.lang.key6: 'L10n v${0} (build: ${1}),
 * };
 * 
 * Usage:
 *   localizationKey | l10n: arguments
 * Example:
 *   {{ 'l10n.lang.key1' | l10n: { version: 1.61.00.1, build: 600124 } }}
 *   formats to: L10n v1.61.00.1 (build: 600124)
*/
@Pipe({
    name: 'l10n',
    pure: false
})
export class L10nPipe implements PipeTransform, OnDestroy {

    private value: string = null;
    private latestKeyValue: string = null;

    private languageSubscription: Subscription;
    private subscription: Subscription;

    constructor(
        private _l10n: L10nService,
        private _ref: ChangeDetectorRef
    ) {
        if (!this.languageSubscription) {
            this.languageSubscription = this._l10n.languageChanges.subscribe(() => this.ngOnDestroy());
        }
    }

    public ngOnDestroy(): void {
        if (this.subscription) {
            this._dispose();
        }
    }

    public transform(key: string, args: any): string {
        if (IsNullOrEmpty(key)) {
            return key;
        }

        if (!IsNullOrEmpty(this.value) && this.latestKeyValue === key) {
            return this.value;
        }

        this.subscription = this._l10n.observe(key, args).subscribe((sentence) => {
            this.value = sentence;
            this._ref.markForCheck();
        });


        this.latestKeyValue = key;
        this.value = this._l10n.get(key, args);
        return this.value;
    }

    private _dispose(): void {
        this.subscription.unsubscribe();
        this.subscription = null;
        this.value = null;
        this.latestKeyValue = null;
    }
}