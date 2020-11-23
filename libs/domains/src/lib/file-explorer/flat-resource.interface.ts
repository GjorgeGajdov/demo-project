import { ResourceType } from './resource-type.enum';

export interface FlatResource {
    id: number;
    name: string;
    type: ResourceType;
    size: number;
    dateCreated: boolean;
    hidden: boolean;
    parentId: number;
}