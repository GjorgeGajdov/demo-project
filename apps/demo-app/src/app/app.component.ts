import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'demo-project-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  constructor(
    private _title: Title,
    private _transloco: TranslocoService
  ) {
    this._transloco.selectTranslate('appName').subscribe(value => this._title.setTitle(value));
  }
}
