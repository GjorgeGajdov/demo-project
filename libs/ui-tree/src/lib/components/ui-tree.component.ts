import { ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { TreeFlatNode } from '@demo-project/domains';

@Component({
    selector: 'ui-tree',
    templateUrl: './ui-tree.component.html',
    styleUrls: ['./ui-tree.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class UiTreeComponent {

    @Input() nodes: TreeFlatNode[];
    @Input() selectedNode: TreeFlatNode;

    @Input() set expandedNodes(value: TreeFlatNode[]) {
        this._expandedNodes = Array.isArray(value) ? value : [];
    }
    get expandedNodes() { return this._expandedNodes; }
    private _expandedNodes: TreeFlatNode[] = [];

    @Input() compareWith: (node1: TreeFlatNode, node2: TreeFlatNode) => boolean;

    @Output() selectedNodeChange = new EventEmitter<TreeFlatNode>();

    constructor(private readonly _cdr: ChangeDetectorRef) { }

    toggleNode(node: TreeFlatNode) {
        const index = this.expandedNodes.indexOf(node);
        if (index > -1) {
            this.expandedNodes.splice(index, 1);
        } else {
            this.expandedNodes.push(node);
        }

        this._cdr.markForCheck();
    }

    isExpanded(node: TreeFlatNode): boolean {
        return this.expandedNodes?.includes(node);
    }

    isSelected(node: TreeFlatNode): boolean {
        if (!this.selectedNode) { return false; }
        if (this.compareWith) {
            return this.compareWith(this.selectedNode, node);
        }
        return node === this.selectedNode;
    }

    selectNode(node: TreeFlatNode) {
        this.selectedNode = node;
        this.selectedNodeChange.emit(node);
    }
}