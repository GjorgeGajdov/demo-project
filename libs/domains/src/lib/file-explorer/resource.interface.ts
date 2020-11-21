import { ResourceType } from './resource-type.enum';

export interface Resource {
    id: number;
    name: string;
    type: ResourceType;
    size: number;
    hidden: boolean;
    children?: Resource[];
}