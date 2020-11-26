import { ResourceType } from './resource-type.enum';

export interface Resource {
    id: number;
    name: string;
    type: ResourceType;
    size: number;
    dateCreated: boolean;
    children?: Resource[];
    // this value is present only if type is 'SHORTCUT', and references to a specific Resource 'id'
    shortcutRefId?: number;
}