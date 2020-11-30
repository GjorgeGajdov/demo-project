import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Resource } from '@demo-project/domains';
import { catchError } from 'rxjs/operators';

@Injectable()
export class FileExplorerService {

    readonly path = 'api/file-explorer';

    constructor(private readonly _http: HttpClient) { }

    findAllResources(): Observable<Resource[]> {
        return this._http.get<Resource[]>(`${this.path}/resources`).pipe(
            catchError(error => {
                console.error(error);
                return of([]);
            })
        );
    }
}