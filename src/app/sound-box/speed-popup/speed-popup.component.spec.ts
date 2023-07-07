import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpeedPopupComponent } from './speed-popup.component';

describe('SpeedPopupComponent', () => {
  let component: SpeedPopupComponent;
  let fixture: ComponentFixture<SpeedPopupComponent>;
  let buttons: HTMLButtonElement[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SpeedPopupComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpeedPopupComponent);
    component = fixture.componentInstance;
    buttons = fixture.nativeElement.querySelectorAll('.speed-button');
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the selected speed when a button is clicked', () => {
    spyOn(component.speedChange, 'emit');
    const speed = 0.5;
    buttons[0].click();
    expect(component.speedChange.emit).toHaveBeenCalledWith(speed);
    expect(component.speedValue).toBe(speed);
  });

  it('should apply "currentValue" class to the button when speedValue matches the button value', () => {
    const speed = 0.9;
    component.speedValue = speed;
    fixture.detectChanges();
    expect(buttons[2].classList.contains('currentValue')).toBeTruthy();
  });

  it('should not apply "currentValue" class to the button when speedValue does not match the button value', () => {
    const speed = 0.9;
    component.speedValue = speed;
    fixture.detectChanges();
    expect(buttons[1].classList.contains('currentValue')).toBeFalsy();
  });
});
