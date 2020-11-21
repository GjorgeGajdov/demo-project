import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { TranslocoRootModule } from './transloco/transloco-root.module';

const modules = [
  TranslocoRootModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class CoreModule {

  constructor(@Optional() @SkipSelf() module: CoreModule) {
    if (module) { throw new Error('CoreModule is already loaded!'); }
  }

  static forRoot(config = {}): ModuleWithProviders<CoreModule> {
    return {
      ngModule: CoreModule
    }
  }
}
