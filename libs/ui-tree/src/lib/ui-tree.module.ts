import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTreeComponent } from './components/ui-tree.component';
import { UiTreeMatModule } from './ui-tree-mat.module';

const components = [
  UiTreeComponent
];

@NgModule({
  imports: [
    CommonModule,
    UiTreeMatModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class UiTreeModule { }
