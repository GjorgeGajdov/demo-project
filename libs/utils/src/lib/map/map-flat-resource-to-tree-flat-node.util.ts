import { FlatResource, TreeFlatNode } from '@demo-project/domains';

export function mapFlatResourceToTreeFlatNode(resource: FlatResource, level: number, expandable: boolean): TreeFlatNode<FlatResource> {
    return {
        name: resource.name,
        level: level,
        expandable: expandable,
        data: resource
    }
}