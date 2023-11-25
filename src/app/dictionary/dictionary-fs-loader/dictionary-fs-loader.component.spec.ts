import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DictionaryFsLoaderComponent } from './dictionary-fs-loader.component';
import { ToastrService } from "ngx-toastr";
import createSpyObj = jasmine.createSpyObj;


describe('DictionaryFsLoaderComponent', () => {
  let component: DictionaryFsLoaderComponent;
  let fixture: ComponentFixture<DictionaryFsLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DictionaryFsLoaderComponent],
      providers: [{ provide: ToastrService, useValue: ToastrService }]
    });
    fixture = TestBed.createComponent(DictionaryFsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a valid JSON file', async () => {
    const VALID_JSON_AS_STRING = "{ \"transcription_config\": { \"language\": \"en\", \"additional_vocab\": [ { \"content\": \"financial crisis\" }, { \"content\": \"gnocchi\", \"sounds_like\": [ \"nyohki\", \"nokey\", \"nochi\" ] }, { \"content\": \"CEO\", \"sounds_like\": [ \"C.E.O.\" ] } ] } }"
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], "validjson.json", { type: 'application/json' });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(MOCK_EVENT)

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should not accept a invalid JSON file', async () => {
    const INVALID_JSON_AS_STRING = "invalid"
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], "invalidjson.json", { type: 'application/json' });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalled();
  });

  it('should not accept a JSON file containing empty language', async () => {
    const INVALID_JSON_AS_STRING = "{ \"transcription_config\": { \"language\": \"\", \"additional_vocab\": [ { \"content\": \"financial crisis\" }, { \"content\": \"gnocchi\", \"sounds_like\": [ \"nyohki\", \"nokey\", \"nochi\" ] }, { \"content\": \"CEO\", \"sounds_like\": [ \"C.E.O.\" ] } ] } }"
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], "invalidjson.json", { type: 'application/json' });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalled();
  });

  it('should accept a JSON file containing empty additional vocab', async () => {
    const VALID_JSON_AS_STRING = "{ \"transcription_config\": { \"language\": \"en\", \"additional_vocab\": [] } }"
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], "valid.json", { type: 'application/json' });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should accept a JSON file containing empty sounds like', async () => {
    const VALID_JSON_AS_STRING = "{ \"transcription_config\": { \"language\": \"en\", \"additional_vocab\": [ { \"content\": \"financial crisis\" }, { \"content\": \"gnocchi\", \"sounds_like\": [] }, { \"content\": \"CEO\", \"sounds_like\": [ \"C.E.O.\" ] } ] } }"
    const MOCK_FILE = new File([VALID_JSON_AS_STRING], "valid.json", { type: 'application/json' });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should not accept a JSON file containing empty content', async () => {
    const INVALID_JSON_AS_STRING = "{}"
    const MOCK_FILE = new File([INVALID_JSON_AS_STRING], "invalidjson.json", { type: 'application/json' });
    const MOCK_EVENT = {
      target: {
        files: [MOCK_FILE]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(MOCK_EVENT);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalled();
  }
  );

  it('should download a JSON file', async () => {
    const spyObject = createSpyObj('a', ['click']);
    spyOn(document, 'createElement').and.returnValue(spyObject);

    component.handleDictionaryDownloadJSON();

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

    component.handleDictionaryDownloadCSV();

    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');

    expect(spyObject.href).toContain('blob:')
    expect(spyObject.download).toBe('dictionary.csv');
    expect(spyObject.click).toHaveBeenCalledTimes(1);
    expect(spyObject.click).toHaveBeenCalledWith();
  });
});

