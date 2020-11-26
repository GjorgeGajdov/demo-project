import { filter } from 'rxjs/operators';

export const notEmpty = <T>() => filter<T>(it => Array.isArray(it) && it.length > 0)