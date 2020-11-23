import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';

const modules = [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule
];

@NgModule({
    imports: [modules],
    exports: [modules]
})
export class FeatureLayoutMatModule { }