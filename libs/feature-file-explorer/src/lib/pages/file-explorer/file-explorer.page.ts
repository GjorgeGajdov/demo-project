import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { FileExplorerStoreService } from '@demo-project/data-access-file-explorer';
import { FlatResource, ResourceType, TreeFlatNode } from '@demo-project/domains';
import { Subject, Observable, combineLatest } from 'rxjs';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { map, take, debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { UploadFileDialog } from '../../dialogs/upload-file/upload-file.dialog';
import { notEmpty } from '@demo-project/utils';
import { ResizeEvent } from 'angular-resizable-element';

@Component({
    selector: 'feature-file-explorer',
    templateUrl: './file-explorer.page.html',
    styleUrls: ['./file-explorer.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerPage implements OnDestroy {

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    private readonly _unsubscribe = new Subject();

    readonly nodes$: Observable<TreeFlatNode<FlatResource>[]> = this._store.nodes$;
    readonly selectedNode$: Observable<TreeFlatNode<FlatResource>> = this._store.selectedNode$;
    readonly folders$: Observable<TreeFlatNode<FlatResource>[]> = this._store.folders$;
    readonly breadcrumbs$ = this._store.breadcrumbs$;
    readonly dataSource$: Observable<MatTableDataSource<FlatResource>>;

    readonly searchCtrl = new FormControl('');

    readonly displayedColumns: string[] = ['name', 'type', 'size', 'dateCreated', 'actions'];

    // this value is in pixels
    uiTreeWidth = 180;

    constructor(
        private readonly _store: FileExplorerStoreService,
        private readonly _router: Router,
        private readonly _route: ActivatedRoute,
        private readonly _dialog: MatDialog
    ) {
        this._store.loadResources();

        const searchTerm$ = this.searchCtrl.valueChanges.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            startWith('')
        );

        this.dataSource$ = combineLatest([
            this.selectedNode$,
            this.nodes$,
            searchTerm$
        ]).pipe(
            map(([activeNode, nodes, searchTerm]) => {
                if (!activeNode) { return new MatTableDataSource<FlatResource>(); }
                const filteredNodes = nodes.filter(n =>
                    n.data.parentId === activeNode.data.id
                    && n.data.name.toLowerCase().includes(searchTerm.toLowerCase()));
                const dataSource = new MatTableDataSource<FlatResource>(filteredNodes.map(n => n.data));
                dataSource.sort = this.sort;
                dataSource.paginator = this.paginator;
                return dataSource;
            })
        );

        combineLatest([
            this._route.queryParamMap,
            this.folders$.pipe(notEmpty())
        ]).pipe(
            takeUntil(this._unsubscribe),
            take(1)
        ).subscribe(([queryParamMap, nodes]) => {
            if (queryParamMap.has('selectedNodeId')) {
                const selectedNode = nodes.find(n => n.data.id === +queryParamMap.get('selectedNodeId'));
                this._store.updateSelectedNode(selectedNode);
            }
        });
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
    }

    compareNodes(node1: TreeFlatNode<FlatResource>, node2: TreeFlatNode<FlatResource>) {
        return `${node1.data.id}:${node1.data.type}` === `${node2.data.id}:${node2.data.type}`;
    }

    selectNode(node: TreeFlatNode<FlatResource>) {
        if (node.data.type === ResourceType.SHORTCUT) {
            this._store.folders$.subscribe(nodes => {
                const nodeRef = nodes.find(n => n.data.id === node.data.shortcutRefId);
                this._store.updateSelectedNode(nodeRef);
                this._router.navigate([], {
                    queryParams: { selectedNodeId: nodeRef.data.id },
                    queryParamsHandling: 'merge'
                });
            });
        } else {
            this._store.updateSelectedNode(node);
            this._router.navigate([], {
                queryParams: { selectedNodeId: node.data.id },
                queryParamsHandling: 'merge'
            });
        }
    }

    openDialog(resource?: FlatResource) {
        this._dialog.open(UploadFileDialog, { data: { resource } });
    }

    clone(resource: FlatResource) {
        this.nodes$.pipe(
            take(1),
            map(nodes => nodes.find(n => n.data.id === resource.id))
        ).subscribe(n => this._store.cloneNode(n));
    }

    delete(resource: FlatResource) {
        this.nodes$.pipe(
            take(1),
            map(nodes => nodes.find(n => n.data.id === resource.id))
        ).subscribe(n => this._store.deleteNode(n));
    }

    resizeEnd(event: ResizeEvent) {
        this.uiTreeWidth = event.rectangle.width;
        console.log('Element was resized', event);
    }

    getResourceIcon(resource: FlatResource): string {
        switch (resource.type) {
            case ResourceType.FILE: return 'insert_drive_file';
            case ResourceType.FOLDER: return 'folder_open';
            case ResourceType.SHORTCUT: return 'folder_open';
        }
    }
}