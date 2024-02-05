import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqComponent } from './faq.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDividerModule } from '@angular/material/divider';


describe('FaqComponent', () => {
  let component: FaqComponent;
  let fixture: ComponentFixture<FaqComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ 
        MatExpansionModule,
        BrowserAnimationsModule,
        MatDividerModule
      ],
      declarations: [FaqComponent]
    });
    fixture = TestBed.createComponent(FaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
