import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LayoutService } from '@demo-project/data-access-layout';
import { LoaderService } from '../../services/loader.service';

@Component({
    selector: 'feature-layout',
    templateUrl: './layout.page.html',
    styleUrls: ['./layout.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LayoutPage {

    readonly navItems$ = this._layoutService.findAllNavItems();
    readonly loading$ = this._loader.loading$;

    constructor(
        private readonly _layoutService: LayoutService,
        private readonly _loader: LoaderService,
    ) { }
}