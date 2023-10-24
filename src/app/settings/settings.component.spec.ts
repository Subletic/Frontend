import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { environment } from '../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [MatIconModule, MatFormFieldModule, FormsModule, MatInputModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.id).toBeUndefined();
    expect(component.seconds).toBe(5);
    expect(component.initialSeconds).toBe(5);
  });

  it('should set the slider value when ngAfterViewInit is called', () => {
    const sliderElement = fixture.nativeElement.querySelector('#seconds-slider');
    component.seconds = 10;
    fixture.detectChanges();

    component.ngAfterViewInit();
    expect(sliderElement.value).toBe('10');
  });

  it('should open and close the modal', () => {
    spyOn(component, 'open').and.callThrough();
    spyOn(component, 'close').and.callThrough();
    spyOn(document.body.classList, 'add');
    spyOn(document.body.classList, 'remove');

    component.open();
    expect(component.open).toHaveBeenCalled();
    expect(document.body.classList.add).toHaveBeenCalledWith('settings-open');

    component.close();
    expect(component.close).toHaveBeenCalled();
    expect(document.body.classList.remove).toHaveBeenCalledWith('settings-open');
  });

  it('should cancel changes and reset seconds value', () => {
    component.seconds = 10;
    component.initialSeconds = 5;

    spyOn(component, 'close');

    component.cancel();
    expect(component.seconds).toBe(5);
    expect(component.close).toHaveBeenCalled();
  });

  it('should apply changes and emit secondsChange event', () => {
    spyOn(component.secondsChange, 'emit');
    spyOn(component, 'close');
  
    component.seconds = 10;
  
    component.apply();
  
    expect(component.secondsChange.emit).toHaveBeenCalledWith(10);
    expect(component.close).toHaveBeenCalled();
  });

  const mockFetch = (status: number) => {
    spyOn(window, 'fetch').and.returnValue(
      Promise.resolve({
        ok: status === 200,
      } as Response)
    );
  };

  it('should handle error when calling backend reload', async () => {
    spyOn(window.console, 'error');
    mockFetch(500);

    component.callBackendReload();
    expect(window.fetch).toHaveBeenCalledWith(environment.apiURL + '/api/restart', { method: 'POST' });

    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(window.console.error).toHaveBeenCalledWith('Error with calling restart');
  });
});