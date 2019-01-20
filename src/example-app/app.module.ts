import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { L10nModule, LanguageCodes } from '@iplab/ngx-l10n';
import { AppComponent } from './app.component';
import { AppLocalizationResolve } from './app-resolve.service';
import { AppLocalizationStorageService } from './app-localization-storage.service';


const appRoutes: Routes = [
  { path: '', component: AppComponent, resolve: { localization: AppLocalizationResolve } }
];



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    L10nModule.forRoot({ 
      storage: AppLocalizationStorageService, 
      config: { defaultLanguage: LanguageCodes.EnglishUnitedStates } 
    }),
    RouterModule.forRoot( appRoutes )
  ],
  providers: [AppLocalizationResolve],
  bootstrap: [AppComponent]
})
export class AppModule { }
