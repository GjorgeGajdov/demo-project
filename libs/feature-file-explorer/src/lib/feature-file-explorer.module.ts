import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerPage } from './pages/file-explorer/file-explorer.page';
import { FeatureFileExplorerRouterModule } from './feature-file-explorer-router.module';
import { DataAccessFileExplorerModule } from '@demo-project/data-access-file-explorer';
import { FeatureFileExplorerMatModule } from './feature-file-explorer-mat.module';
import { UiTreeModule } from '@demo-project/ui-tree';
import { FlexLayoutModule } from '@angular/flex-layout';
import { TranslocoModule } from '@ngneat/transloco';
import { ReactiveFormsModule } from '@angular/forms';

const pages = [
  FileExplorerPage
];

@NgModule({
  imports: [
    CommonModule,
    FeatureFileExplorerRouterModule,
    DataAccessFileExplorerModule,
    FeatureFileExplorerMatModule,
    UiTreeModule,
    FlexLayoutModule,
    TranslocoModule,
    ReactiveFormsModule
  ],
  declarations: [...pages]
})
export class FeatureFileExplorerModule { }
