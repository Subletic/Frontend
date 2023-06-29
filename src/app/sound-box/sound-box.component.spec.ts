import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoundBoxComponent } from './sound-box.component';
import { AudioHandlerComponent } from '../audio-handler/audio-handler.component';

describe('SoundBoxComponent', () => {
  let component: SoundBoxComponent;
  let fixture: ComponentFixture<SoundBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SoundBoxComponent, AudioHandlerComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoundBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
