import { FlatResource, Resource, TreeFlatNode } from '@demo-project/domains';
import { mapResourceToTreeFlatNode } from './map-resource-to-tree-flat-node.util';

export function mapResourcesToTreeFlatNodes(resources: Resource[]): TreeFlatNode<FlatResource>[] {
    const result = [];
    flattenNodesRecursively(resources, result, 0, null);
    return result;
};

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
