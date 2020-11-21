import { NgModule } from '@angular/core';
import { TranslocoRootModule } from './transloco/transloco-root.module';

const modules = [
  TranslocoRootModule
];

@NgModule({
  imports: [...modules],
  exports: [...modules]
})
export class CoreModule { }
