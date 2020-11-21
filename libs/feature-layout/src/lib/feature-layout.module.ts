import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPage } from './pages/layout/layout.page';
import { FeatureLayoutMatModule } from './feature-layout-mat.module';
import { FeatureLayoutRouterModule } from './feature-layout-router.module';
import { DataAccessLayoutModule } from '@demo-project/data-access-layout';
import { TranslocoModule } from '@ngneat/transloco';

const pages = [LayoutPage];

@NgModule({
  imports: [
    CommonModule,
    FeatureLayoutRouterModule,
    FeatureLayoutMatModule,
    DataAccessLayoutModule,
    TranslocoModule
  ],
  declarations: [...pages]
})
export class FeatureLayoutModule { }
