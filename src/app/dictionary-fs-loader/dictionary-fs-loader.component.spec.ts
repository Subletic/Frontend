import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DictionaryFsLoaderComponent} from './dictionary-fs-loader.component';
import {ToastrService} from "ngx-toastr";


describe('DictionaryFsLoaderComponent', () => {
  let component: DictionaryFsLoaderComponent;
  let fixture: ComponentFixture<DictionaryFsLoaderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DictionaryFsLoaderComponent],
      providers: [{provide: ToastrService, useValue: ToastrService}]
    });
    fixture = TestBed.createComponent(DictionaryFsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should accept a valid JSON file', async () => {
    const validJSONAsString = "{ \"transcription_config\": { \"language\": \"en\", \"additional_vocab\": [ { \"content\": \"financial crisis\" }, { \"content\": \"gnocchi\", \"sounds_like\": [ \"nyohki\", \"nokey\", \"nochi\" ] }, { \"content\": \"CEO\", \"sounds_like\": [ \"C.E.O.\" ] } ] } }"
    const mockFile = new File([validJSONAsString], "validjson.json", {type: 'application/json'});
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(mockEvent)

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should not accept a invalid JSON file', async () => {
    const invalidJsonAsString = "invalid"
    const mockFile = new File([invalidJsonAsString], "invalidjson.json", {type: 'application/json'});
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(mockEvent);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalled();
  });

  it('should not accept a JSON file containing empty language', async () => {
    const invalidJsonAsString = "{ \"transcription_config\": { \"language\": \"\", \"additional_vocab\": [ { \"content\": \"financial crisis\" }, { \"content\": \"gnocchi\", \"sounds_like\": [ \"nyohki\", \"nokey\", \"nochi\" ] }, { \"content\": \"CEO\", \"sounds_like\": [ \"C.E.O.\" ] } ] } }"
    const mockFile = new File([invalidJsonAsString], "invalidjson.json", {type: 'application/json'});
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionaryErrorToast');

    await component.handleFileUpload(mockEvent);

    expect(component.displayDictionaryErrorToast).toHaveBeenCalled();
  });

  it('should accept a JSON file containing empty additional vocab', async () => {
    const validJsonAsString = "{ \"transcription_config\": { \"language\": \"en\", \"additional_vocab\": [] } }"
    const mockFile = new File([validJsonAsString], "valid.json", {type: 'application/json'});
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(mockEvent);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });

  it('should accept a JSON file containing empty sounds like', async () => {
    const validJsonAsString = "{ \"transcription_config\": { \"language\": \"en\", \"additional_vocab\": [ { \"content\": \"financial crisis\" }, { \"content\": \"gnocchi\", \"sounds_like\": [] }, { \"content\": \"CEO\", \"sounds_like\": [ \"C.E.O.\" ] } ] } }"
    const mockFile = new File([validJsonAsString], "valid.json", {type: 'application/json'});
    const mockEvent = {
      target: {
        files: [mockFile]
      }
    } as unknown as Event;

    spyOn(component, 'displayDictionarySuccessToast');

    await component.handleFileUpload(mockEvent);

    expect(component.displayDictionarySuccessToast).toHaveBeenCalled();
  });
});


