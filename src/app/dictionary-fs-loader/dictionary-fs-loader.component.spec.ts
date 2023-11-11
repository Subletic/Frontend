import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DictionaryFsLoaderComponent } from './dictionary-fs-loader.component';

describe('DictionaryFsLoaderComponent', () => {
  let component: DictionaryFsLoaderComponent;
  let fixture: ComponentFixture<DictionaryFsLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DictionaryFsLoaderComponent]
    });
    fixture = TestBed.createComponent(DictionaryFsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
