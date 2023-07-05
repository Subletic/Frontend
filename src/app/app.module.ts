import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SoundBoxComponent } from './sound-box/sound-box.component';
import { TextBoxComponent } from './text-box/text-box.component';
import { TextSheetComponent } from './textSheet/textSheet.component';
import { AudioHandlerComponent } from './audio-handler/audio-handler.component';
import { SettingsComponent } from './settings/settings.component';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';


import { MatSliderModule } from '@angular/material/slider';
import { SliderPopupComponent } from './sound-box/slider-popup/slider-popup.component';



@NgModule({
  declarations: [
    AppComponent,
    SoundBoxComponent,
    TextSheetComponent,
    TextBoxComponent,
    AudioHandlerComponent,
    SettingsComponent,
    SliderPopupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
