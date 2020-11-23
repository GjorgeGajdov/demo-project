import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPage } from './pages/layout/layout.page';
import { FeatureLayoutMatModule } from './feature-layout-mat.module';
import { DataAccessLayoutModule } from '@demo-project/data-access-layout';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';
import { LoaderService } from './services/loader.service';

const pages = [LayoutPage];

@NgModule({
  imports: [
    CommonModule,
    FeatureLayoutMatModule,
    DataAccessLayoutModule,
    TranslocoModule,
    RouterModule
  ],
  declarations: [...pages],
  providers: [LoaderService],
  exports: [...pages]
})
export class FeatureLayoutModule {

  constructor(@Optional() @SkipSelf() module: FeatureLayoutModule) {
    if (module) { throw new Error('FeatureLayoutModule is already imported. FeatureLayoutModule should only be imported once in AppModule.'); }
  }

  static forRoot(config = {}): ModuleWithProviders<FeatureLayoutModule> {
    return {
      ngModule: FeatureLayoutModule
    }
  }
}
