import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StartConfigComponent } from './start-config.component';
import { MatSliderModule } from '@angular/material/slider';

describe('StartConfigComponent', () => {
  let component: StartConfigComponent;
  let fixture: ComponentFixture<StartConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StartConfigComponent],
      imports: [MatSliderModule],
    });
    fixture = TestBed.createComponent(StartConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format slider values correctly', () => {
    const value = 5;
    const expectedValue = '3';

    const result = component.mapSliderValues(value);

    expect(result).toEqual(expectedValue);
  });

  it('should update selected buffer length correctly', () => {
    const event = { target: { value: '5' } } as unknown as Event;
    const expectedIndex = 5;
    const expectedBufferLength = 3;

    component.updateSelectedBufferLength(event);

    expect(component.selectedIndex).toEqual(expectedIndex);
    expect(component.selectedBufferLength).toEqual(expectedBufferLength);
  });

  it('should get selected buffer length correctly', () => {
    const expectedBufferLength = 2;

    const result = component.getSelectedBufferLength();

    expect(result).toEqual(expectedBufferLength);
  });

  it('should handle invalid slider value on update', () => {
    const event = { target: { value: 'invalid' } } as unknown as Event;

    component.updateSelectedBufferLength(event);

    expect(component.selectedIndex).toBeNaN();
    expect(component.selectedBufferLength).toBeNaN();
  });

  it('should handle out of range slider value on update', () => {
    const event = { target: { value: '20' } } as unknown as Event;

    component.updateSelectedBufferLength(event);

    expect(component.selectedIndex).toEqual(20);
    expect(component.selectedBufferLength).toBeNaN();
  });
});
