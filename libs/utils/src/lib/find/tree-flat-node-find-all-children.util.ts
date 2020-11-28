import { TreeFlatNode } from '@demo-project/domains';

export function treeFlatNodeFindAllChildren<T = any>(node: TreeFlatNode<T>, nodes: TreeFlatNode<T>[]): TreeFlatNode<T>[] {
    if (!node || !nodes) { return []; }

    const result = [];
    const minLevel = node.level;

    const nodeIndex = nodes.indexOf(node);
    // this is the last node return empty array
    if (nodeIndex === nodes.length - 1) { return []; }

    let currentIndex = nodeIndex + 1;
    let level = nodes[currentIndex + 1].level;

    while (minLevel < level) {
        result.push(nodes[currentIndex]);
        currentIndex++;
        level = nodes[currentIndex] ? nodes[currentIndex].level : 0;
    }

    return result;
}