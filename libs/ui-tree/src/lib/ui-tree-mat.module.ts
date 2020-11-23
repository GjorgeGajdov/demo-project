import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

const modules = [
    MatButtonModule,
    MatIconModule,
    MatRippleModule
];

@NgModule({
    imports: [...modules],
    exports: [...modules]
})
export class UiTreeMatModule { }