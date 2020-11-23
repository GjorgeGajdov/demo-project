export interface TreeFlatNode<T = any> {
    name: string;
    level: number;
    expandable: boolean;
    data?: T;
}