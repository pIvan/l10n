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
import { L10nFormatter, L10nBaseFormatter } from './services/l10n-formatter.service';
import { L10nConfig, IL10nConfig } from './services/l10n-config.service';
import { L10nErrorHandler, L10nBaseErrorHandler } from './services/l10n-error-handler.service';

import { L10nDirective } from './directives/l10n.directive';
import { L10nPipe } from './pipes/l10n.pipe';

export { L10nService } from './services/l10n.service';
export { L10nBaseLoader, IL10nLoaderResponse } from './services/l10n-loader.service';
export { L10nBaseStorage } from './services/l10n-storage.service';
export { L10nBaseParser } from './services/l10n-parser.service';
export { L10nBaseFormatter, defineInterpolation } from './services/l10n-formatter.service';
export { L10nBaseErrorHandler } from './services/l10n-error-handler.service';

export { LanguageCodes } from './helpers/language-codes.class';
export { L10nProperties } from './helpers/l10n-properties.class';
export { L10nPo } from './helpers/l10n-po.class';
export { IL10nDictionary, IL10nFileRequest, IL10nArguments } from './helpers/helpers.class';

export interface IL10nModuleConfig {
  loader?: any;
  storage?: any;
  parser?: any;
  formatter?: any;
  errorHandler?: any;
  config?: IL10nConfig;
}

export const LOCALIZATION_L10N_CONFIG = new InjectionToken<void>('LOCALIZATION_L10N_CONFIG');

export function configFactory(userConfig: IL10nModuleConfig) {
  let config = new L10nConfig();
  return Object.assign(config, userConfig.config);
}

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

  constructor(l10n: L10nService) {
  }

  public static forRoot(configuration: IL10nModuleConfig = {}): ModuleWithProviders {
    return {
      ngModule: L10nModule,
      providers: [
        { provide: LOCALIZATION_L10N_CONFIG, useValue: configuration },
        { provide: L10nBaseLoader, useClass: configuration.loader || L10nLoader },
        { provide: L10nBaseStorage, useClass: configuration.storage || L10nStorage },
        { provide: L10nBaseParser, useClass: configuration.parser || L10nParser },
        { provide: L10nBaseFormatter, useClass: configuration.formatter || L10nFormatter },
        { provide: L10nBaseErrorHandler, useClass: configuration.errorHandler || L10nErrorHandler },
        { provide: L10nConfig, useFactory: configFactory, deps: [LOCALIZATION_L10N_CONFIG] }
      ]
    }
  }
}