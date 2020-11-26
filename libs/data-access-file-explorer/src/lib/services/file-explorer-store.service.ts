import { Injectable } from '@angular/core';
import { FlatResource, ResourceType, TreeFlatNode } from '@demo-project/domains';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileExplorerService } from './file-explorer.service';
import { mapFlatResourceToTreeFlatNode, mapResourcesToTreeFlatNodes, treeFlatNodeFindAllChildren, treeFlatNodeFindAllParents } from '@demo-project/utils';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslocoService } from '@ngneat/transloco';

/* This is temporary solution that serves as an alternative for NgRx Store. */
@Injectable()
export class FileExplorerStoreService {

    private readonly _nodesSubject = new BehaviorSubject<TreeFlatNode<FlatResource>[]>([]);
    private readonly _selectedNodeSubject = new BehaviorSubject<TreeFlatNode<FlatResource>>(null);

    readonly nodes$: Observable<TreeFlatNode<FlatResource>[]> = this._nodesSubject.asObservable();
    readonly selectedNode$: Observable<TreeFlatNode<FlatResource>> = this._selectedNodeSubject.asObservable();
    readonly breadcrumbs$: Observable<string[]>;

    readonly folders$: Observable<TreeFlatNode<FlatResource>[]>;

    constructor(
        private readonly _service: FileExplorerService,
        private readonly _snackBar: MatSnackBar,
        private readonly _transloco: TranslocoService
    ) {
        this.folders$ = this.nodes$.pipe(
            map(nodes => nodes.filter(n => [ResourceType.FOLDER, ResourceType.SHORTCUT].includes(n.data.type)))
        );

        this.breadcrumbs$ = this.selectedNode$.pipe(
            map(node => {
                return [
                    node?.name,
                    ...treeFlatNodeFindAllParents<FlatResource>(node, this._nodesSubject.value)
                        .map(n => n.name)
                ];
            })
        );
    }

    loadResources() {
        this._service.findAllResources().pipe(
            map(mapResourcesToTreeFlatNodes)
        ).subscribe(nodes => this._nodesSubject.next(nodes));
    }

    updateSelectedNode(node: TreeFlatNode) {
        this._selectedNodeSubject.next(node);
    }

    saveOrUpdateNode(resource: FlatResource) {
        // temporary simulation until API calls are implemented
        if (resource.id) {
            const node = this._nodesSubject.value.find(n => n.data.id === resource.id);
            const index = this._nodesSubject.value.indexOf(node);
            node.name = resource.name;
            node.data = resource;
            this._nodesSubject.next(this._nodesSubject.value);
        } else {
            const parentNode = this._nodesSubject.value.find(n => n.data.id === resource.parentId);
            const index = this._nodesSubject.value.indexOf(parentNode);
            const level = parentNode ? parentNode.level + 1 : 0;

            if (parentNode && [ResourceType.FOLDER, ResourceType.SHORTCUT].includes(resource.type)) {
                parentNode.expandable = true
            }

            const node = mapFlatResourceToTreeFlatNode(resource, level, false);

            node.data.id = resource.id || Math.round(Math.random() * 10000000);
            this._nodesSubject.next([
                ...this._nodesSubject.value.slice(0, index + 1),
                node,
                ...this._nodesSubject.value.slice(index + 1)
            ]);
        }

        this._snackBar.open(`${this._transloco.translate('messages.successfullyUploadFile')}!`, null, {
            duration: 2000,
        });
    }

    cloneNode(node: TreeFlatNode) {
        // temporary simulation until API calls are implemented

        // clone node
        // copy (1) to name,
        // find all children

        this._snackBar.open(`${this._transloco.translate('messages.successfullyClonedFile')}!`, null, {
            duration: 2000,
        });
    }

    deleteNode(node: TreeFlatNode) {
        // temporary simulation until API calls are implemented
        const deletedNodes = [
            ...treeFlatNodeFindAllChildren<FlatResource>(node, this._nodesSubject.value),
            node,
        ];

        this._nodesSubject.next(
            this._nodesSubject.value.filter(n => deletedNodes.indexOf(n) === -1)
        );

        this._snackBar.open(`${this._transloco.translate('messages.successfullyDeletedFile')}!`, null, {
            duration: 2000,
        });
    }
}