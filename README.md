# @localization/l10n
> Pure Angular localization (l10n) library.



[![npm version](https://badge.fury.io/js/%40localization%2Fl10n.svg)](https://www.npmjs.com/package/@localization/l10n)
[![Build Status](https://travis-ci.org/pIvan/l10n.svg?branch=master)](https://travis-ci.org/pIvan/l10n)
[![npm](https://img.shields.io/npm/v/npm.svg)](https://www.npmjs.com/package/@localization/l10n)
[![GitHub issues](https://img.shields.io/github/issues-raw/badges/shields.svg)](https://www.npmjs.com/package/@localization/l10n)
[![Known Vulnerabilities](https://snyk.io/test/npm/@localization/l10n/badge.svg)](https://snyk.io/test/npm/@localization/l10n)

# Demo

[Click here for preview](https://pivan.github.io/l10n/)


# Description

- It's an Angular functional set (pipe, directive, service) used to localize application
- Compatible with Angular 2+ versions
- No external dependency
- Supported some of the most used localization files: .properties, .po, .json
- Load localization file/s when you need it
- Easily manage localization storage
- Customizable localization loader


# Tested with

- Firefox (latest)
- Chrome (latest)
- Chromium (latest)
- Edge
- IE11

## Installing / Getting started


```shell
npm install @localization/l10n
```

Use the following snippet inside your app module: 
```shell
import { L10nModule, L10nService, LanguageCodes } from '@localization/l10n';
...
...

@Injectable()
export class LocalizationResolve implements Resolve {

    constructor(private localization: L10nService){
        this.localization.languageChanges.subscribe(({ code }) => {
            this.localization.setFromFile(`${code}.locales.properties`);
        })
    }

    public resolve(): Observable|Promise {
        return this.localization.setFromFile(`${this.localization.languageCode}.locales.properties`);
    }
}

@NgModule({
    imports: [
        BrowserModule,
        L10nModule.forRoot({ config: { defaultLanguage: LanguageCodes.EnglishUnitedStates } }),
        RouterModule.forRoot([
            { path: '', component: AppComponent, resolve: { localization: LocalizationResolve }}
        ])
    ],
    providers: [LocalizationResolve],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

Use the following snippet inside your component: 
```shell
import { L10nService } from '@localization/l10n';


@Component({
  ...
})
export class AppComponent {

  constructor(private localization: L10nService) {
  }
}
```

Use the following snippet inside your template: 
```shell
<div l10n="app.hello.key" [l10n-args]="params"></div>
<div l10n="app.hello.key" [l10n-args]="{value: 'world'}"></div>
<div l10n="app.hello.key" l10n-args="{value: 'world'}"></div>

<div [l10n]="'app.hello.key'" [l10n-args]="params"></div>
<div [l10n]="'app.hello.key'" l10n-args="{value: 'world'}"></div>

<div>{{'app.hello.key' | l10n:param }}</div>
<div [innerHTML]="'app.hello.key' | l10n"></div>
<div>{{'app.hello.key' | l10n: {'key': 'value'} }}</div>
```


## NativeScript
```shell
tns plugin add @localization/l10n
```

Use the following snippet inside your app module: 
```shell
import { L10nModule, L10nService, L10nBaseLoader } from '@localization/l10n';
import { knownFolders } from "file-system";
import { Subject, Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Resolve } from "@angular/router";
...
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptRouterModule } from "nativescript-angular/router";
...
...

@Injectable()
export class CustomLoader extends L10nBaseLoader {

    private readonly folderName = 'locales'; // folder where you place your locale files, 
                                            // in our case that is locales/en.locales.properties
    private readonly documents = knownFolders.currentApp();
    private readonly folder = this.documents.getFolder(this.folderName);

    public getFile({ url, code }: IL10nFileRequest ): Observable<IL10nLoaderResponse> {
        let fileType = this.getFileExtension( url );                           
        let file = this.folder.getFile(url);

        return from(file.readText())
                .pipe(map((response) => {
                    return { response, fileType }
                }));
    }
}

@Injectable()
export class LocalizationResolve implements Resolve {

    constructor(private localization: L10nService){
        this.localization.languageChanges.subscribe(({ code }) => {
            this.localization.setFromFile(`${code}.locales.properties`);
        })
    }

    public resolve(): Observable|Promise {
        return this.localization.setFromFile(`${this.localization.languageCode}.locales.properties`);
    }
}

@NgModule({
    imports: [
        NativeScriptModule,
        L10nModule.forRoot({ 
            config: {defaultLanguage: LanguageCodes.EnglishUnitedStates, bindingProperty: 'text' },
            loader: CustomLoader
        }),
        NativeScriptRouterModule.forRoot([
            { path: '', component: AppComponent, resolve: { localization: LocalizationResolve }}
        ])
    ],
    providers: [
        LocalizationResolve,
        L10nService, // because currently NativeScript doesn\'t work with @Injectable({ providedIn: \'root\' })
        CustomLoader
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
```

Use the following snippet inside your template: 
```shell
<ActionBar title="{{ 'app.header.title' | l10n }}" class="action-bar"></ActionBar>
<ActionBar [title]="'app.hello.key' | l10n"></ActionBar>
<Label text="{{'app.hello.key' | l10n }}"></Label>
<Button text="{{'app.hello.key' | l10n }}" (tap)="onTap($event)"></Button>
```

If bindingProperty in configuration is set to text l10 directive
will use it as default element property
```shell
<Label l10n="app.hello.key" [l10n-args]="params"></Label>
<Label l10n="app.hello.key" [l10n-args]="{value: 'world'}"></Label>
<Label l10n="app.hello.key" l10n-args="{value: 'world'}"></Label>

<Label [l10n]="'app.hello.key'" [l10n-args]="params"></Label>
<Label [l10n]="'app.hello.key'" l10n-args="{value: 'world'}"></Label>
```


## Developing

### Built With: 
- Angular
- RxJS

### Setting up Dev

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.

[Angular CLI](https://github.com/angular/angular-cli) must be installed before building L10n project.

```shell
npm install -g @angular/cli
```

```shell
git clone https://github.com/pIvan/l10n.git
cd l10n/
npm install
npm run start
```
Open "http://localhost:4200" in browser


## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [link to tags on this repository](https://github.com/pIvan/l10n/tags).

## Tests

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.0.7.


[Angular CLI](https://github.com/angular/angular-cli) must be installed before testing L10n project.

```shell
npm install -g @angular/cli
```


```shell
git clone https://github.com/pIvan/l10n.git
cd l10n/
npm install
npm run test
```

## Contributing

### Want to help?

Want to file a bug, contribute some code, or improve documentation? Excellent! Read up on our [contributing guide](https://github.com/pIvan/l10n/blob/master/CONTRIBUTING.md) and then check out one of our [issues](https://github.com/pIvan/l10n/issues).



## Licensing

L10n is freely distributable under the terms of the [MIT license](https://github.com/pIvan/l10n/blob/master/LICENSE).