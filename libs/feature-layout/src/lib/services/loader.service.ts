import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router } from '@angular/router';

@Injectable()
export class LoaderService {

    private readonly _loadingSubject = new BehaviorSubject<boolean>(false);

    readonly loading$ = this._loadingSubject.asObservable();

    constructor(private readonly _router: Router) {

        this._router.events
            .subscribe(event => {
                if (event instanceof NavigationStart) { this.start(); }
                if (event instanceof NavigationEnd) { this.stop(); }
                // stop loader in case a request fails
                if (event instanceof NavigationCancel || event instanceof NavigationError) { this.stop() }
            });
    }

    start() {
        this._loadingSubject.next(true);
    }

    stop() {
        this._loadingSubject.next(false);
    }
}