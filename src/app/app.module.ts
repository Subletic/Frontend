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
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSliderModule } from '@angular/material/slider';
import { SliderPopupComponent } from './sound-box/slider-popup/slider-popup.component';
import { SpeedPopupComponent } from './sound-box/speed-popup/speed-popup.component';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { DictionaryFsLoaderComponent } from './dictionary/dictionary-fs-loader/dictionary-fs-loader.component';
import { ToastrModule } from 'ngx-toastr';

import { DictionaryEditorComponent } from './dictionary/dictionary-editor/dictionary-editor.component';
import { DictionaryRowComponent } from './dictionary/dictionary-row/dictionary-row.component';
import { NgOptimizedImage } from '@angular/common';
import { StartConfigComponent } from './start-config/start-config.component';

@NgModule({
  declarations: [
    AppComponent,
    SoundBoxComponent,
    TextSheetComponent,
    TextBoxComponent,
    AudioHandlerComponent,
    SettingsComponent,
    SliderPopupComponent,
    SpeedPopupComponent,
    DictionaryEditorComponent,
    DictionaryRowComponent,
    DictionaryFsLoaderComponent,
    StartConfigComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSliderModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatDividerModule,
    ToastrModule.forRoot(),
    NgOptimizedImage,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
