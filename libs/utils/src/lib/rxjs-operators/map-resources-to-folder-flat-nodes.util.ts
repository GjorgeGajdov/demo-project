import { map } from 'rxjs/operators';
import { Resource, FlatResource } from '@demo-project/domains';
import { TreeFlatNode } from '@demo-project/domains';

export const mapResourcesToTreeFlatNodes = () => map<Resource[], TreeFlatNode<FlatResource>[]>(resources => {
    const result = [];
    flattenNodesRecursively(resources, result, 0, null);
    return result;
});

function flattenNodesRecursively(
    resources: Resource[],
    nodes: TreeFlatNode<FlatResource>[],
    level: number,
    parentId: number
) {
    resources.forEach(r => {
        const hasChildren = r.children?.length > 0;
        nodes.push(mapResourceToTreeFlatNode(r, level, hasChildren, parentId));
        if (hasChildren) {
            flattenNodesRecursively(r.children, nodes, level + 1, r.id);
        }
    })
};

function mapResourceToTreeFlatNode(
    resource: Resource,
    level: number,
    expandable: boolean,
    parentId: number
): TreeFlatNode<FlatResource> {
    return {
        name: resource.name,
        level: level,
        expandable: expandable,
        data: {
            id: resource.id,
            name: resource.name,
            type: resource.type,
            size: resource.size,
            dateCreated: resource.dateCreated,
            hidden: resource.hidden,
            parentId: parentId
        }
    }
};