import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileExplorerPage } from './pages/file-explorer/file-explorer.page';
import { FeatureFileExplorerRouterModule } from './feature-file-explorer-router.module';
import { DataAccessFileExplorerModule } from '@demo-project/data-access-file-explorer';

const pages = [
  FileExplorerPage
];

@NgModule({
  imports: [
    CommonModule,
    FeatureFileExplorerRouterModule,
    DataAccessFileExplorerModule
  ],
  declarations: [...pages]
})
export class FeatureFileExplorerModule { }
