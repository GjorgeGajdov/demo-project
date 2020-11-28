export function insertAtIndex<T = any>(arr: T[], index: number, items: T | T[]): T[] {
    return [
        // part of the array before the specified index
        ...arr.slice(0, index),
        // inserted items
        ...Array.isArray(items) ? items : [items],
        // part of the array after the specified index
        ...arr.slice(index)
    ];
}