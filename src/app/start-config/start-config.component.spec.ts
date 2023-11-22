import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartConfigComponent } from './start-config.component';

describe('StartConfigComponent', () => {
  let component: StartConfigComponent;
  let fixture: ComponentFixture<StartConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartConfigComponent]
    });
    fixture = TestBed.createComponent(StartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
