import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';

import { SoundBoxComponent } from './sound-box/sound-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { TextSheetComponent } from './textSheet/textSheet.component';
import { AudioHandlerComponent } from './audio-handler/audio-handler.component';

@NgModule({
  declarations: [
    AppComponent,
    SoundBoxComponent,
    TextSheetComponent,
    TextBoxComponent,
    AudioHandlerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
