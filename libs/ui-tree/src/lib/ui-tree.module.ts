import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTreeComponent } from './components/ui-tree/ui-tree.component';
import { UiTreeMatModule } from './ui-tree-mat.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UiTreeNodeDirective } from './directives/ui-tree-node.directive';

const components = [
  UiTreeComponent
];

const directives = [
  UiTreeNodeDirective
];

@NgModule({
  imports: [
    CommonModule,
    UiTreeMatModule,
    FlexLayoutModule
  ],
  declarations: [...components, ...directives],
  exports: [...components, ...directives]
})
export class UiTreeModule { }
