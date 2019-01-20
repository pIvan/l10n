import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { L10nService } from '@iplab/ngx-l10n';
import { Observable } from 'rxjs';


@Injectable()
export class AppLocalizationResolve implements Resolve<void> {

    constructor(private localization: L10nService) {
        this.localization.languageChanges.subscribe(({ code }) => {
            // this.localization.clear();
            this.localization.setFromFile(`assets/${code}.locales.properties`);
        });
    }

    public resolve(): Observable<any> | Promise<any> {
        return this.localization.setFromFile(`assets/${this.localization.languageCode}.locales.properties`);
    }
}