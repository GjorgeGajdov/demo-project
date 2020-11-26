import { TreeFlatNode } from '@demo-project/domains';

export function treeFlatNodeFindAllChildren<T = any>(node: TreeFlatNode<T>, nodes: TreeFlatNode<T>[]): TreeFlatNode<T>[] {
    if (!node || !nodes) { return []; }

    const result = [];
    const minLevel = node.level;

    let index = nodes.indexOf(node);
    // this is the last node return empty array
    if (index === nodes.length - 1) { return []; }

    let level = nodes[index + 1].level;

    while (minLevel < level) {
        index++;
        result.push(nodes[index]);
        level = nodes[index].level;
    }

    return result;
}