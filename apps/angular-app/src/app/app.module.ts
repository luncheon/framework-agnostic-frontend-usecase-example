import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { SharedModule } from './shared/shared.module'

import { AppComponent } from './app.component'
import { WorksheetComponent } from './worksheet.component'
import { WorksheetService } from './worksheet.services'

@NgModule({
  declarations: [
    AppComponent,
    WorksheetComponent,
  ],
  imports: [
    BrowserModule,
    SharedModule,
  ],
  providers: [
    WorksheetService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
