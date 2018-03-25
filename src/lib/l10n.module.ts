/*
 * l10n
 * 
 * By Ivan Pintar, http://www.pintar-ivan.com
 * Licensed under the MIT License
 * See https://github.com/pIvan/l10n/blob/master/README.md
 */
import { NgModule, ModuleWithProviders, InjectionToken, Optional, Inject, SkipSelf } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { L10nService } from './services/l10n.service';
import { L10nLoader, L10nBaseLoader } from './services/l10n-loader.service';
import { L10nStorage, L10nBaseStorage } from './services/l10n-storage.service';
import { L10nParser, L10nBaseParser } from './services/l10n-parser.service';
import { L10nConfig } from './services/l10n-config.service';

import { L10nDirective } from './directives/l10n.directive';
import { L10nPipe } from './pipes/l10n.pipe';


export { L10nService } from './services/l10n.service';
export { L10nBaseLoader, IL10nLoaderResponse } from './services/l10n-loader.service';
export { L10nBaseStorage } from './services/l10n-storage.service';
export { L10nBaseParser } from './services/l10n-parser.service';

export { LanguageCodes } from './helpers/language-codes.class';
export { L10nProperties } from './helpers/l10n-properties.class';
export { L10nPo } from './helpers/l10n-po.class';
export { IL10nDictionary, IL10nFileRequest } from './helpers/helpers.class';


export interface IL10nModuleConfig {
  loader?: any;
  storage?: any;
  parser?: any;
  config?: L10nConfig;
}

export const LOCALIZATION_L10N_FORROOT_GUARD = new InjectionToken<void>('LOCALIZATION_L10N_FORROOT_GUARD');

export function localizationProvideForRootGuard(l10n: L10nService): any {
  if (l10n) {
    throw new Error(`L10nModule.forRoot() called twice. Lazy loaded modules should use L10nModule instead.`);
  }
  return 'guarded';
}

const LOCALIZATION_PROVIDERS = [
  L10nService
]

@NgModule({
  imports: [
    HttpClientModule
  ],
  declarations: [
    L10nDirective,
    L10nPipe
  ],
  exports: [
    L10nDirective,
    L10nPipe
  ]
})
export class L10nModule {

  constructor(@Optional() @Inject(LOCALIZATION_L10N_FORROOT_GUARD) guard: any, @Optional() l10n: L10nService) {
  }

  public static forRoot(configuration: IL10nModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: L10nModule,
      providers: [
        LOCALIZATION_PROVIDERS,
        {
          provide: LOCALIZATION_L10N_FORROOT_GUARD,
          useFactory: localizationProvideForRootGuard,
          deps: [[L10nService, new Optional(), new SkipSelf()]]
        },
        { provide: L10nBaseLoader, useClass: configuration.loader || L10nLoader },
        { provide: L10nBaseStorage, useClass: configuration.storage || L10nStorage },
        { provide: L10nBaseParser, useClass: configuration.parser || L10nParser },
        { provide: L10nConfig, useValue: configuration.config || {} }
      ]
    }
  }
}