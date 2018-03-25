import { Component, ElementRef, AfterViewInit } from '@angular/core';
import { L10nService, LanguageCodes, IL10nDictionary } from '@localization/l10n';
import * as prettify from 'google-code-prettify/bin/prettify.min.js';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  public languages: {code: string; language: string}[] = [
    { code: LanguageCodes.EnglishUnitedStates, language: 'English - United States' },
    { code: LanguageCodes.CroatianCroatian, language: 'Croatian - Croatian' },
    { code: LanguageCodes.GermanGermany, language: 'German - Germany' },
    { code: LanguageCodes.FrenchFrance, language: 'French - France' }
  ];

  public language: string;

  constructor(private localization: L10nService, private elRef: ElementRef){    
  }

  public get dictionary(): IL10nDictionary {
    return this.localization.dictionary;
  }

  public ngAfterViewInit(){
    this.elRef.nativeElement.querySelectorAll('.prettify')
      .forEach(( el: HTMLElement ) => el.innerHTML = prettify.prettyPrintOne(el.innerHTML));
  }

  public languangeChange( selection: string ): void {
    this.localization.language = selection;
  }

  private prepareLanguages(): void {
    Object.keys(LanguageCodes).forEach((language: string) => {
      const lang = language.split(/(?=[A-Z])/);
      lang[1] ? lang[0] += ' - ' : null;

      this.languages.push({ code: LanguageCodes[language], language: lang.join(' ') })
    })
  }
}
