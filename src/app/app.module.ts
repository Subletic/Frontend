import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';

import { SoundBoxComponent } from './sound-box/sound-box.component';
import { SpeechbubbleComponent } from './textSheet/speechbubble/speechbubble.component';
import { TextSheetComponent } from './textSheet/textSheet.component';
import { AudioHandlerComponent } from './sound-box/audio-handler/audio-handler.component';
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
import { DictionaryFsLoaderComponent } from './start-page/dictionary/dictionary-fs-loader/dictionary-fs-loader.component';
import { ToastrModule } from 'ngx-toastr';

import { WordComponent } from './textSheet/speechbubble/word/word.component';
import { DictionaryEditorComponent } from './start-page/dictionary/dictionary-editor/dictionary-editor.component';
import { DictionaryRowComponent } from './start-page/dictionary/dictionary-row/dictionary-row.component';
import { ExportPopupComponent } from './start-page/dictionary/dictionary-fs-loader/export-popup/export-popup.component';
import { NgOptimizedImage } from '@angular/common';
import { StartConfigComponent } from './start-page/start-config/start-config.component';
import { StartPageComponent } from './start-page/start-page.component';
import { ContinuePopupComponent } from './start-page/continue-popup/continue-popup.component';
import { FaqButtonComponent } from './faq-button/faq-button.component';
import { FaqComponent } from './faq/faq.component';
import { AppRoutingModule } from './app-routing.module';
import { MatExpansionModule } from '@angular/material/expansion';
import { HotkeyMenueComponent } from './hotkey-menue/hotkey-menue.component';
import { NoSpecialCharsDirective } from './start-page/dictionary/dictionary-row/no-special-chars.directive';
import { NoSpecialCharsWithCommasDirective } from './start-page/dictionary/dictionary-row/no-spec-chars-com.directive';

@NgModule({
  declarations: [
    AppComponent,
    SoundBoxComponent,
    TextSheetComponent,
    SpeechbubbleComponent,
    AudioHandlerComponent,
    SettingsComponent,
    SliderPopupComponent,
    SpeedPopupComponent,
    DictionaryEditorComponent,
    DictionaryRowComponent,
    DictionaryFsLoaderComponent,
    WordComponent,
    ExportPopupComponent,
    StartConfigComponent,
    StartPageComponent,
    ContinuePopupComponent,
    FaqButtonComponent,
    FaqComponent,
    HotkeyMenueComponent,
    NoSpecialCharsDirective,
    NoSpecialCharsWithCommasDirective,
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
    AppRoutingModule,
    MatExpansionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
