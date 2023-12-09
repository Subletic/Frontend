import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartPageComponent } from './start-page.component';
import { ToastrService } from 'ngx-toastr';
import { DictionaryEditorComponent } from './dictionary/dictionary-editor/dictionary-editor.component';
import { DictionaryRowComponent } from './dictionary/dictionary-row/dictionary-row.component';
import { DictionaryFsLoaderComponent } from './dictionary/dictionary-fs-loader/dictionary-fs-loader.component';
import { StartConfigComponent } from './start-config/start-config.component';
import { MatSliderModule } from '@angular/material/slider';

describe('StartPageComponent', () => {
  let component: StartPageComponent;
  let fixture: ComponentFixture<StartPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        StartPageComponent,
        DictionaryEditorComponent,
        DictionaryRowComponent,
        DictionaryFsLoaderComponent,
        StartConfigComponent,
      ],
      providers: [{ provide: ToastrService, useValue: ToastrService }],
      imports: [MatSliderModule],
    });
    fixture = TestBed.createComponent(StartPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
