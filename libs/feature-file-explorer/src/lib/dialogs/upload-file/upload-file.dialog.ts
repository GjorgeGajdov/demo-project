import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FlatResource, TreeFlatNode } from '@demo-project/domains';

@Component({
    templateUrl: './upload-file.dialog.html',
    styleUrls: ['./upload-file.dialog.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileDialog {

    constructor(@Inject(MAT_DIALOG_DATA) public readonly data: { resource: FlatResource }) { }
}