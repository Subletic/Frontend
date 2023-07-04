import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsComponent],
      imports: [MatIconModule, MatFormFieldModule, FormsModule, ReactiveFormsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set "sprungweite" to 5 by default', () => {
    expect(component.sprungweite).toBe(5);
  });

  it('should have the "Ok" button disabled by default', () => {
    const okButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.settings-button:first-child'
    );
    expect(okButton.disabled).toBeTruthy();
  });

  it('should enable the "Ok" button when "sprungweite" is between 1 and 120', () => {
    component.sprungweite = 60;
    fixture.detectChanges();

    const okButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.settings-button:first-child'
    );
    expect(okButton.disabled).toBeFalsy();
  });

  it('should emit the "secondsChange" event when "Ok" button is clicked', () => {
    spyOn(component.secondsChange, 'emit');
    component.sprungweite = 30;
    fixture.detectChanges();

    const okButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      '.settings-button:first-child'
    );
    okButton.click();

    expect(component.secondsChange.emit).toHaveBeenCalledWith(30);
  });

  it('should close the modal when "close" button is clicked', () => {
    spyOn(component, 'close');

    const closeButton: HTMLButtonElement = fixture.nativeElement.querySelector(
      'button[mat-icon-button]'
    );
    closeButton.click();

    expect(component.close).toHaveBeenCalled();
  });

});