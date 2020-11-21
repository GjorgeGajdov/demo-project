import { Component } from '@angular/core';
import { FileExplorerService } from '@demo-project/data-access-file-explorer';

@Component({
    selector: 'feature-file-explorer',
    templateUrl: './file-explorer.page.html',
    styleUrls: ['./file-explorer.page.scss']
})
export class FileExplorerPage {

    readonly resources$ = this._fileExplorerService.findAllResources();

    constructor(private readonly _fileExplorerService: FileExplorerService) { }
}