<a name="2.1.5"></a>
## [2.1.5](https://github.com/pIvan/l10n/commit/0f1890bc3654e012ba04057a3c7f359a2007eec8) (2018-05-22)


### Code Refactoring
* **L10nService:** refactored rxjs implementations

### Possible Breaking Changes
* **L10nService:** methods `setFromFile` and `setFromObject` return Promise instead Observable, since here we don't track any sequence 

### Small Features
* **error handling:** implemented new error handling service `L10nErrorHandler`
  ```
  @Injectable()
  export class L10nErrorHandler extends L10nBaseErrorHandler {
    public handleError(error: any): void {
        handle error
    }
  }

  @NgModule({
      imports: [
          ...,
          L10nModule.forRoot({ 
              errorHandler: L10nErrorHandler
          })
      ],
      bootstrap: []
  })
  export class AppModule {}
  ```



<a name="2.1.3"></a>
## [2.1.3](https://github.com/pIvan/l10n/commit/1f90c04184f12e890682ab728771d4a06c2edb3f) (2018-05-16)

### Bug Fixes
* **L10nPipe:** fixed problem that caused `pipe` "blink" when value has been changed ([a26d235](https://github.com/pIvan/l10n/commit/a26d2356fd1c57a6884cac41c5ebc9aa81f00cbd))
### Small Features
* **L10nFormatter:** interpolation algorithm optimized ([1f90c04](https://github.com/pIvan/l10n/commit/1f90c04184f12e890682ab728771d4a06c2edb3f))



<a name="2.1.1"></a>
## [2.1.1](https://github.com/pIvan/l10n/commit/660dab59bf06e009645602701d94a47a699ae7cb) (2018-05-15)

### Bug Fixes
* **L10nService:** fixed memory leak when key is observed



<a name="2.1.0"></a>
## [2.1.0](https://github.com/pIvan/l10n/commit/fe8184c98d02171f592c0536198e99eb26de8a13) (2018-05-13)

### Small Features
* **interpolation:** implemented formatter to provide greater control over output value
  ```
  @Injectable()
  export class CustomFormatter extends L10nBaseFormatter {
      public interpolate(sentence: string, args: IL10nArguments): string {
        return sentence.replace( defineInterpolation(['[[', ']]']), (match, interpolates) => {   
            if (!IsNullOrEmpty(args)) {
                return args[this.trim(interpolates)];
            }
            return match;
        });
    }
  }


  @NgModule({
      imports: [
          BrowserModule,
          L10nModule.forRoot({ 
              formatter: CustomFormatter
          })
      ],
      bootstrap: []
  })
  export class AppModule {}
  ```



<a name="2.0.0"></a>
## [2.0.0](https://github.com/pIvan/l10n/commit/99e232a64d1fdd7feb991877802c81f24fcfa3d2) (2018-05-11)

### Dependency updates

* @localizaction/l10n now depends on
  * TypeScript 2.7
  * RxJS ^6.0.0
  * @angular/core ^6.0.0



<a name="1.2.0"></a>
## [1.2.0](https://github.com/pIvan/l10n/commit/aad928f3f0a9ccd3637850192ab907e71725916f) (2018-05-21)

### Dependency updates
* @localizaction/l10n now depends on
  * ng-packagr ^2.4.4
### Bug Fixes
* **interpolation:** do not iterate over multipe cases, return first match
* **pipe:** do not blink when value has been changed
* **L10nService:** fixed memory leak when key is observed
### Small Features
* **interpolation:** dictionary sentence evaluation logic has moved from l10n to separate class (`check version 2.1.0`)
* **L10nFormatter:** interpolation algorithm optimized



<a name="1.1.1"></a>
## [1.1.1](https://github.com/pIvan/l10n/commit/4707ed28b0706d9804b79e327981e2bc99b36334) (2018-04-15)

### Bug Fixes
* **rxjs:** fixed issue with map as unknown function on observable object




<a name="1.1.0"></a>
## [1.1.0](https://github.com/pIvan/l10n/commit/7d7a038151045939263f33d1542e79eda68027cc) (2018-03-30)

### Small Features
* **L10nModule:** added configuration for default property used by directive ([7d7a038](https://github.com/pIvan/l10n/commit/7d7a038151045939263f33d1542e79eda68027cc))
  ```
  @NgModule({
      imports: [
          BrowserModule,
          L10nModule.forRoot({ 
              config: { 
                  bindingProperty: 'textContent' 
              } 
          })
      ],
      bootstrap: []
  })
  export class AppModule {}
  ```



<a name="1.0.0"></a>
## [1.0.0](https://github.com/pIvan/l10n/commit/01bd1c94774f5dda6b640b0437f82e9bd1b7c67e) (2018-03-25)

### Initial release