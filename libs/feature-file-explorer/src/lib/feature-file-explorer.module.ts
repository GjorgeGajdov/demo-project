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
import { UploadFileComponent } from './components/upload-file/upload-file.component';
import { UploadFileDialog } from './dialogs/upload-file/upload-file.dialog';
import { ResizableModule } from 'angular-resizable-element';

const pages = [
  FileExplorerPage
];

const components = [
  UploadFileComponent
];

const dialogs = [
  UploadFileDialog
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
    ReactiveFormsModule,
    ResizableModule
  ],
  declarations: [...pages, ...components, ...dialogs]
})
export class FeatureFileExplorerModule { }
