import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextBoxComponent } from './text-box.component';

import * as $ from 'jquery';

describe('TextBoxComponent', () => {
  let component: TextBoxComponent;
  let fixture: ComponentFixture<TextBoxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextBoxComponent]
    });
    fixture = TestBed.createComponent(TextBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
