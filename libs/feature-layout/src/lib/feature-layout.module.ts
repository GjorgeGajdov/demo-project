import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutPage } from './pages/layout/layout.page';
import { FeatureLayoutMatModule } from './feature-layout-mat.module';
import { DataAccessLayoutModule } from '@demo-project/data-access-layout';
import { TranslocoModule } from '@ngneat/transloco';
import { RouterModule } from '@angular/router';

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
  exports: [...pages]
})
export class FeatureLayoutModule { }
