import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavItem } from '@demo-project/domains';

@Injectable()
export class LayoutService {

    readonly path = '/api/layout';

    constructor(private readonly _http: HttpClient) { }

    findAllNavItems(): Observable<NavItem[]> {
        return this._http.get<NavItem[]>(`${this.path}/nav-items`);
    }
}