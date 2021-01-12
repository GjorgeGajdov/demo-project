import { Directive } from '@angular/core';
import { CdkPortal } from '@angular/cdk/portal';

@Directive({
    selector: 'ng-template[uiTreeNode]'
})
export class UiTreeNodeDirective extends CdkPortal { }