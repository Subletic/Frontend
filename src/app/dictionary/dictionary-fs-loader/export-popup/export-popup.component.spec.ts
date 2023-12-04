import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ExportPopupComponent } from './export-popup.component';
import { DictionaryFsLoaderComponent } from '../dictionary-fs-loader.component';
import createSpyObj = jasmine.createSpyObj;
import { ToastrService } from "ngx-toastr";
import { ToastrModule } from 'ngx-toastr';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

describe('ExportPopupComponent', () => {
  let component: ExportPopupComponent;
  let fixture: ComponentFixture<ExportPopupComponent>;

  //let dictionaryFsLoaderComponent: DictionaryFsLoaderComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExportPopupComponent],
      imports: [ToastrModule.forRoot(), MatIconModule, FormsModule], // Import ToastrModule and configure it
      providers: [
        DictionaryFsLoaderComponent,
        ToastrService, // Provide ToastrService
      ],
    });

    fixture = TestBed.createComponent(ExportPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create the popup', () => {
    expect(component).toBeTruthy();
  });

  it('should close the popup', () => {
    spyOn(component.closed, 'emit');

    component.close();

    expect(component.closed.emit).toHaveBeenCalledTimes(1);
  });

  it('should download a JSON file', async () => {
    const spyObject = createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(spyObject);

    component.handleDictionaryDownloadJson();

    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');

    expect(spyObject.href).toContain('blob:')
    expect(spyObject.download).toBe('dictionary.json');
    expect(spyObject.click).toHaveBeenCalledTimes(1);
    expect(spyObject.click).toHaveBeenCalledWith();
  });

  it('should download a CSV file', async () => {
    const spyObject = createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(spyObject);

    component.handleDictionaryDownloadCsv();

    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');

    expect(spyObject.href).toContain('blob:')
    expect(spyObject.download).toBe('dictionary.csv');
    expect(spyObject.click).toHaveBeenCalledTimes(1);
    expect(spyObject.click).toHaveBeenCalledWith();
  });
});
