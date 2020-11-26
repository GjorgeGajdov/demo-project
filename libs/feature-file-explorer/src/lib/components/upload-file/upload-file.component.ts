import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileExplorerStoreService } from '@demo-project/data-access-file-explorer';
import { FlatResource, ResourceType } from '@demo-project/domains';
import { resourceParentFolderValidator } from '@demo-project/utils';
import { Observable, of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'feature-upload-file',
    templateUrl: './upload-file.component.html',
    styleUrls: ['./upload-file.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadFileComponent implements OnDestroy {

    @Input() set resource(value: FlatResource) {
        if (value) {
            this.form.patchValue(value);
        }
    }

    readonly folders$ = this._store.folders$;
    readonly resourceTypes$: Observable<string[]>;

    readonly form: FormGroup;
    readonly resourceType = ResourceType;

    private readonly _unsubscribe = new Subject();

    constructor(
        private readonly _store: FileExplorerStoreService,
        private readonly _builder: FormBuilder,
        private readonly _dialogRef: MatDialogRef<UploadFileComponent>
    ) {
        this.form = this._builder.group({
            id: [],
            name: [null, Validators.required],
            type: [null, Validators.required],
            dateCreated: [new Date(), Validators.required],
            parentId: [null, resourceParentFolderValidator()]
        });

        this.resourceTypes$ = of(Object.keys(ResourceType));

        this.form.get('type').valueChanges.pipe(
            takeUntil(this._unsubscribe),
        ).subscribe(type => {
            if (type === ResourceType.SHORTCUT) {
                this.form.addControl('shortcutRefId', this._builder.control(null, Validators.required))
            } else {
                this.form.removeControl('shortcutRefId');
            }

            // resourceParentFolderValidator depends on 'type', so when 'type' changes we need to update 'parentId'
            this.form.get('parentId').updateValueAndValidity({ onlySelf: true })
        });
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    submit() {
        if (this.form.valid) {
            this._store.saveOrUpdateNode(this.form.value);
            this._dialogRef.close();
        }
    }
}