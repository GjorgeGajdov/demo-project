import { NgModule } from '@angular/core';
import { FileExplorerStoreService } from './services/file-explorer-store.service';
import { FileExplorerService } from './services/file-explorer.service';

@NgModule({
  providers: [FileExplorerService, FileExplorerStoreService],
})
export class DataAccessFileExplorerModule { }
