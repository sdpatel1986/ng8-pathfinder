import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared';
import {
  BoardComponent,
  BoardDescriptionComponent,
  TutorialComponent,
  ColorPickerComponent,
} from './components';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    BoardDescriptionComponent,
    TutorialComponent,
    ColorPickerComponent,
  ],
  imports: [AppRoutingModule, SharedModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
