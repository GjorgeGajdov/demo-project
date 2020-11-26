import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiTreeComponent } from './components/ui-tree.component';
import { UiTreeMatModule } from './ui-tree-mat.module';
import { FlexLayoutModule } from '@angular/flex-layout';

const components = [
  UiTreeComponent
];

@NgModule({
  imports: [
    CommonModule,
    UiTreeMatModule,
    FlexLayoutModule
  ],
  declarations: [...components],
  exports: [...components]
})
export class UiTreeModule { }
