import { ChangeDetectionStrategy, Component, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { FileExplorerService } from '@demo-project/data-access-file-explorer';
import { FlatResource, ResourceType, TreeFlatNode } from '@demo-project/domains';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { mapResourcesToTreeFlatNodes } from '@demo-project/utils';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { shareReplay, map, filter, take, takeUntil, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'feature-file-explorer',
    templateUrl: './file-explorer.page.html',
    styleUrls: ['./file-explorer.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileExplorerPage {

    @ViewChild(MatSort, { static: true }) sort: MatSort;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

    private readonly _selectedNodeSubject = new BehaviorSubject<TreeFlatNode<FlatResource>>(null);

    readonly nodes$: Observable<TreeFlatNode<FlatResource>[]>;
    readonly folders$: Observable<TreeFlatNode<FlatResource>[]>;
    readonly dataSource$: Observable<MatTableDataSource<FlatResource>>;
    readonly selectedNode$: Observable<TreeFlatNode<FlatResource>>;

    readonly searchCtrl = new FormControl('');

    readonly displayedColumns: string[] = ['name', 'type', 'size', 'dateCreated'];

    constructor(
        private readonly _fileExplorerService: FileExplorerService,
        private readonly _router: Router,
        private readonly _route: ActivatedRoute
    ) {
        this.selectedNode$ = this._selectedNodeSubject.asObservable();
        this.nodes$ = this._fileExplorerService.findAllResources().pipe(
            mapResourcesToTreeFlatNodes(),
            shareReplay(1)
        );

        this.folders$ = this.nodes$.pipe(
            map(nodes => nodes.filter(n => [ResourceType.FOLDER, ResourceType.SHORTCUT].includes(n.data.type)))
        );

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
            this.folders$
        ]).pipe(take(1))
            .subscribe(([queryParamMap, nodes]) => {
                if (queryParamMap.has('selectedNodeId')) {
                    const selectedNode = nodes.find(n => n.data.id === +queryParamMap.get('selectedNodeId'));
                    this._selectedNodeSubject.next(selectedNode);
                }
            });
    }

    compareNodes(node1: TreeFlatNode<FlatResource>, node2: TreeFlatNode<FlatResource>) {
        return `${node1.data.id}:${node1.data.type}` === `${node2.data.id}:${node2.data.type}`;
    }

    selectNode(node: TreeFlatNode) {
        this._selectedNodeSubject.next(node);
        this._router.navigate([], {
            queryParams: { selectedNodeId: node.data.id },
            queryParamsHandling: 'merge'
        });
    }
}