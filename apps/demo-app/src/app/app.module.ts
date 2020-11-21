import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from '@demo-project/core';
import { FeatureLayoutModule } from '@demo-project/feature-layout';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule.forRoot(),
    FeatureLayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
