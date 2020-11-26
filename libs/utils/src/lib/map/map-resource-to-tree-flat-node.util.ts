import { FlatResource, Resource, TreeFlatNode } from '@demo-project/domains';

export function mapResourceToTreeFlatNode(
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
            parentId: parentId
        }
    }
};