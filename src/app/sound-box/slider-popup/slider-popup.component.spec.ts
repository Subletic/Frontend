import { ComponentFixture, TestBed } from '@angular/core/testing'
import { SliderPopupComponent } from './slider-popup.component'

describe('SliderPopupComponent', () => {
  let component: SliderPopupComponent
  let fixture: ComponentFixture<SliderPopupComponent>
  let slider: HTMLInputElement

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SliderPopupComponent],
    }).compileComponents()
  })

  beforeEach(() => {
    fixture = TestBed.createComponent(SliderPopupComponent)
    component = fixture.componentInstance
    slider = fixture.nativeElement.querySelector('.styled-slider')
    fixture.detectChanges()
  })

  it('should create the component', () => {
    expect(component).toBeTruthy()
  })

  it('should emit the correct volume value when the slider value changes', () => {
    spyOn(component.volumeChange, 'emit')
    const VOLUME = 0.5
    slider.value = '50'
    slider.dispatchEvent(new Event('input'))
    expect(component.volumeChange.emit).toHaveBeenCalledWith(VOLUME)
    expect(component.volume).toBe(VOLUME)
  })

  it('should emit the correct volume100 value when the slider value changes', () => {
    spyOn(component.volume100Change, 'emit')
    const VOLUME100 = 50
    slider.value = '50'
    slider.dispatchEvent(new Event('input'))
    expect(component.volume100Change.emit).toHaveBeenCalledWith(VOLUME100)
    expect(component.getVolume100()).toBe(VOLUME100)
  })

  it('should set the default volume value to 0 if not provided', () => {
    expect(component.volume).toBe(0)
  })
})
