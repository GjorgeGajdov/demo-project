import { Injectable } from '@angular/core';
import { FlatResource, ResourceType, TreeFlatNode } from '@demo-project/domains';
import { BehaviorSubject, Observable } from 'rxjs';
import { FileExplorerService } from './file-explorer.service';
import { insertAtIndex, mapFlatResourceToTreeFlatNode, mapResourcesToTreeFlatNodes, treeFlatNodeFindAllChildren, treeFlatNodeFindAllParents } from '@demo-project/utils';
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

    readonly foldersAndShortcuts$: Observable<TreeFlatNode<FlatResource>[]>;

    constructor(
        private readonly _service: FileExplorerService,
        private readonly _snackBar: MatSnackBar,
        private readonly _transloco: TranslocoService
    ) {
        this.foldersAndShortcuts$ = this.nodes$.pipe(
            map(nodes => nodes.filter(n => this._isFolderOrShortcut(n.data.type)))
        );

        // the breadcrumbs are a combination of selected node and all of it's parent nodes
        this.breadcrumbs$ = this.selectedNode$.pipe(
            map(node => {
                return [
                    node?.name,
                    ...treeFlatNodeFindAllParents<FlatResource>(node, this._nodesSubject.value).map(n => n.name)
                ];
            })
        );
    }

    loadResources() {
        this._service.findAllResources().pipe(
            map(mapResourcesToTreeFlatNodes)
        ).subscribe(nodes => this._nodesSubject.next(nodes));
    }

    /** 
     * Updates 'selectedNode' in the store. 
     * If node type is 'ResourceType.SHORTCUT' find the shortcut reference folder and sets it as 'selectedNode',
     * else sets the node as 'selectedNode'.
     */
    updateSelectedNode(node: TreeFlatNode) {
        if (node?.data.type === ResourceType.SHORTCUT) {
            const nodeRef = this._nodesSubject.value.find(n => n.data.id === node.data.shortcutRefId);
            this._selectedNodeSubject.next(nodeRef);
        } else {
            this._selectedNodeSubject.next(node);
        }
    }

    /** If the resource has 'id' updates the resource and it's children, else inserts the resource (mapped as node) */
    saveOrUpdateNode(resource: FlatResource) {
        // TODO: refactor this after API calls are implemented
        // this is temporary simulation until API calls are implemented

        // find node reference
        const node = this._nodesSubject.value.find(n => n.data.id === resource.id);
        const nodeIndex = this._nodesSubject.value.findIndex(n => n.data.id === resource.id);
        const parentNode = this._nodesSubject.value.find(n => n.data.id === resource.parentId);
        const parentNodeIndex = this._nodesSubject.value.indexOf(parentNode);

        const nodeLevel = parentNode ? parentNode.level + 1 : 0;
        const expandable = resource.id ? node.expandable : false;

        // TODO: check if name is already present in the parent's children, 
        // if node name is present use '_getCloneName' method to update the name with the right Copy(number)
        const newNode = mapFlatResourceToTreeFlatNode(resource, nodeLevel, expandable);

        // if node has 'resource.id' this is update
        if (resource.id) {
            // if node 'parentId' is not updated, all we have to do is to update the current node with the newNode
            if (node.data.parentId === newNode.data.parentId) {
                this._replaceNode(nodeIndex, newNode)
            }
            // if node 'parentId' is updated will need to update the children as well
            else {
                this._updateNode(node, newNode, parentNodeIndex)
            }
        } else {
            // if this node is placed as a first child, update 'expandable' to for the parent
            if (parentNode && this._isFolderOrShortcut(resource.type)) {
                parentNode.expandable = true;
            }
            newNode.data.id = resource.id || this._randomId; // simulate new id
            this._nodesSubject.next(insertAtIndex(this._nodesSubject.value, parentNodeIndex + 1, newNode));
        }

        this._snackBar.open(`${this._transloco.translate('messages.successfullyUploadFile')}!`, null, {
            duration: 2000,
        });
    }

    cloneNode(node: TreeFlatNode<FlatResource>) {
        // TODO: refactor this after API calls are implemented
        // this is temporary simulation until API calls are implemented

        const newName = this._getCloneName(node.name, node.data.parentId);
        const newNode: TreeFlatNode<FlatResource> = {
            ...node,
            name: newName,
            data: {
                ...node.data,
                id: this._randomId,
                name: newName,
                dateCreated: new Date(),
            }
        };

        const newNodes = [newNode];

        // clone children and update their 'id' & 'parentId'
        if (newNode.data.type === ResourceType.FOLDER) {
            const children = treeFlatNodeFindAllChildren<FlatResource>(node, this._nodesSubject.value)
                .map(c => ({
                    ...c,
                    data: {
                        ...c.data,
                        id: this._randomId,
                        parentId: newNode.data.id
                    }
                }));

            newNodes.push(...children);
        }

        const parentNode = this._nodesSubject.value.find(n => n.data.id === node.data.parentId);
        const parentNodeIndex = this._nodesSubject.value.indexOf(parentNode);

        // insert cloned nodes after parent
        this._nodesSubject.next(insertAtIndex(this._nodesSubject.value, parentNodeIndex + 1, newNodes));

        this._snackBar.open(`${this._transloco.translate('messages.successfullyClonedFile')}!`, null, {
            duration: 2000,
        });
    }

    /** Deletes the node and all the children for the node. */
    deleteNode(node: TreeFlatNode<FlatResource>) {
        const deletedNodes = [
            ...this._isFolderOrShortcut(node.data.type)
                ? treeFlatNodeFindAllChildren<FlatResource>(node, this._nodesSubject.value)
                : [],
            node,
        ];

        this._nodesSubject.next(
            this._nodesSubject.value.filter(n => deletedNodes.indexOf(n) === -1)
        );

        // TODO: implement API calls
        this._snackBar.open(`${this._transloco.translate('messages.successfullyDeletedFile')}!`, null, {
            duration: 2000,
        });
    }

    /** Remove this when API calls are implemented. */
    private get _randomId(): number { return Math.round(Math.random() * 10000000); }

    /** 
     * Search for 'name' in 'parentId' child nodes and if name is present,
     * returns a new 'name' with Copy in the name
     */
    private _getCloneName(name: string, parentId: number): string {
        const index = this._nodesSubject.value
            .findIndex(n => n.data.parentId === parentId && n.name.includes(`${name} Copy (`));
        if (index > -1) {
            const existingName = this._nodesSubject.value[index].name;
            const startIndex = existingName.indexOf('Copy (') + 6; // + 6 because the length of 'Copy (' is 6
            const numberOfCopies = +existingName.substring(startIndex, existingName.lastIndexOf(')'));
            return `${existingName.substring(0, startIndex - 6)} Copy (${numberOfCopies + 1})`;
        }
        return `${name} Copy (1)`;
    }

    private _replaceNode(oldNodeIndex: number, newNode: TreeFlatNode<FlatResource>) {
        this._nodesSubject.value[oldNodeIndex] = newNode;
        this._nodesSubject.next(this._nodesSubject.value);
    }

    private _updateNode(
        oldNode: TreeFlatNode<FlatResource>,
        newNode: TreeFlatNode<FlatResource>,
        parentNodeIndex: number
    ) {
        // store children for a later usage
        let children = treeFlatNodeFindAllChildren(oldNode, this._nodesSubject.value);

        // delete node
        this.deleteNode(oldNode);

        // difference between previous node level and new node level
        // this is important if parent folder is updated
        const levelDiff = oldNode.level - newNode.level;

        // update child nodes' level
        children = children.map(c => ({ ...c, level: c.level - levelDiff }));

        // merge newNode with updated child nodes
        const newNodes = [newNode, ...children];

        // finds the previous parent node
        const prevNodeParent = this._nodesSubject.value.find(n => n.data.id === oldNode.data.parentId);

        // find all child nodes of the previous parent node
        const parentNodeChildFolders = treeFlatNodeFindAllChildren(prevNodeParent, this._nodesSubject.value)
            .filter(n => this._isFolderOrShortcut(n.data.type));
        // if the previous parent node has no child folders update 'expandable' to false
        if (parentNodeChildFolders.length === 0) {
            prevNodeParent.expandable = false;
        }

        const result = insertAtIndex(this._nodesSubject.value, parentNodeIndex + 1, newNodes);
        this._nodesSubject.next(result);
    }

    private _isFolderOrShortcut(type: ResourceType): boolean {
        return [ResourceType.FOLDER, ResourceType.SHORTCUT].includes(type);
    }
}