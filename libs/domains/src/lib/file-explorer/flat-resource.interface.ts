import { ResourceType } from './resource-type.enum';

export interface FlatResource {
    id: number;
    name: string;
    type: ResourceType;
    size: number;
    dateCreated: Date;
    parentId: number;
    // this value is present only if type is 'SHORTCUT', and references to a specific Resource 'id'
    shortcutRefId?: number;
}