import { TreeFlatNode } from '@demo-project/domains';

export function treeFlatNodeFindAllParents<T = any>(node: TreeFlatNode<T>, nodes: TreeFlatNode<T>[]): TreeFlatNode<T>[] {
    if (!node || !nodes) { return []; }
    if (node.level === 0) { return []; }

    const result = [];
    let index = nodes.indexOf(node);
    let level = node.level;

    while (level !== 0) {
        index--;
        const currentNode = nodes[index];
        if (currentNode.level < level) {
            result.push(currentNode);
            level--;
        }
    }

    return result.reverse();
}