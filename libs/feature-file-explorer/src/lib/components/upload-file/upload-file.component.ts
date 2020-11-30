import { ChangeDetectionStrategy, Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FileExplorerStoreService } from '@demo-project/data-access-file-explorer';
import { FlatResource, ResourceType, TreeFlatNode } from '@demo-project/domains';
import { resourceParentFolderValidator } from '@demo-project/utils';
import { Observable, of, Subject, combineLatest } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';

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
            if (value.id) {
                this.form.get('type').disable();
            }
        }
    }

    readonly folders$: Observable<TreeFlatNode<FlatResource>[]>;
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
            id: [null],
            name: [null, Validators.required],
            type: [null, Validators.required],
            dateCreated: [new Date(), Validators.required],
            parentId: [null, resourceParentFolderValidator()]
        });

        this.resourceTypes$ = of(Object.keys(ResourceType));
        this.folders$ = combineLatest([
            this._store.foldersAndShortcuts$,
            this.form.get('id').valueChanges.pipe(startWith(this.form.value.id))
        ]).pipe(
            takeUntil(this._unsubscribe),
            map(([foldersAndShortcuts, id]) => {
                // TODO: filter current node and all of it's children from the folder response
                // we don't want a folder to be able to choose him self as a parent
                return foldersAndShortcuts.filter(it => it.data.type === ResourceType.FOLDER);
            })
        );

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
        // 'getRawValue()', because value does not return disabled values
        this._store.saveOrUpdateNode(this.form.getRawValue());
        this._dialogRef.close();
    }
}