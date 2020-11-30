import { EventEmitter, OnDestroy, Output } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TreeFlatNode } from '@demo-project/domains';
import { BehaviorSubject, Observable, combineLatest, Subject } from 'rxjs';
import { map, takeUntil, take } from 'rxjs/operators';
import { treeFlatNodeFindAllParents } from '@demo-project/utils';

@Component({
    selector: 'ui-tree',
    templateUrl: './ui-tree.component.html',
    styleUrls: ['./ui-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTreeComponent implements OnDestroy {

    @Input() set nodes(value: TreeFlatNode[]) {
        this._nodesSubject.next(Array.isArray(value) ? value : []);
    }
    private readonly _nodesSubject = new BehaviorSubject<TreeFlatNode[]>([]);

    @Input() set selectedNode(value: TreeFlatNode) {
        this._selectedNodeSubject.next(value);
    }
    get selectedNode(): TreeFlatNode { return this._selectedNodeSubject.value; }
    private readonly _selectedNodeSubject = new BehaviorSubject<TreeFlatNode>(null);

    get expandedNodes(): Set<TreeFlatNode> { return this._expandedNodesSubject.value; }
    private readonly _expandedNodesSubject = new BehaviorSubject<Set<TreeFlatNode>>(new Set<TreeFlatNode>());

    /** Function that compare two nodes, based on custom implementation. */
    @Input() compareWith: (node1: TreeFlatNode, node2: TreeFlatNode) => boolean;

    @Output() selectedNodeChange = new EventEmitter<TreeFlatNode>();

    readonly displayedNodes$: Observable<TreeFlatNode[]>;

    private readonly _unsubscribe = new Subject();

    constructor() {
        this.displayedNodes$ = combineLatest([
            this._nodesSubject,
            this._expandedNodesSubject
        ]).pipe(
            takeUntil(this._unsubscribe),
            map(([nodes, _]) => {
                if (nodes.length === 0) { return []; }
                const result = [nodes[0]];
                let lastInsertedNode = nodes[0];

                for (let i = 1; i < nodes.length; i++) {
                    const n = nodes[i];

                    // check if current node level is equal or less than previous node level
                    const isEqualOrLess = n.level <= lastInsertedNode.level;

                    // check is current node level is greater than previous node is expanded
                    const isGreatOrExpanded = n.level > lastInsertedNode.level && this.isExpanded(lastInsertedNode);

                    if (isEqualOrLess || isGreatOrExpanded) {
                        result.push(n);
                        lastInsertedNode = n;
                    }
                }

                return result;
            })
        );

        // when nodes or selectedNode changes, find all parent nodes for the selected node and expands them
        combineLatest([
            this._nodesSubject,
            this._selectedNodeSubject
        ]).pipe(
            takeUntil(this._unsubscribe),
        ).subscribe(([nodes, selectedNode]) => {
            const nodeRef = nodes.find(n => this._compareNodes(n, selectedNode));
            treeFlatNodeFindAllParents(nodeRef, nodes).forEach(n => this.expandedNodes.add(n));
            this._expandedNodesSubject.next(new Set(this.expandedNodes));
        });
    }

    ngOnDestroy() {
        this._unsubscribe.next();
        this._unsubscribe.complete();
        this._nodesSubject.complete();
        this._selectedNodeSubject.complete();
        this._expandedNodesSubject.complete();
    }

    toggleNode(event: MouseEvent, node: TreeFlatNode) {
        event.stopPropagation();
        if (this.expandedNodes.has(node)) {
            this.expandedNodes.delete(node)
        } else {
            this.expandedNodes.add(node);
        }
        this._expandedNodesSubject.next(this.expandedNodes);
    }

    isExpanded(node: TreeFlatNode): boolean {
        return this.expandedNodes.has(node);
    }

    isSelected(node: TreeFlatNode): boolean {
        return this._compareNodes(this.selectedNode, node);
    }

    selectNode(node: TreeFlatNode) {
        this._selectedNodeSubject.next(node);
        this.selectedNodeChange.emit(node);
    }

    private _compareNodes(node1: TreeFlatNode, node2: TreeFlatNode): boolean {
        if (!node1 || !node2) { return false; }
        if (this.compareWith) { return this.compareWith(node1, node2); }
        return node1 === node2;
    }
}