import { Component } from '@angular/core';
import { LayoutService } from '@demo-project/data-access-layout';

@Component({
    selector: 'feature-layout',
    templateUrl: './layout.page.html',
    styleUrls: ['./layout.page.scss']
})
export class LayoutPage {

    readonly navItems$ = this._layoutService.findAllNavItems();

    constructor(private readonly _layoutService: LayoutService) { }
}