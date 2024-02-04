import { ConfigurationService } from './configuration.service';
import { dictionary } from '../data/dictionary/dictionary.model';
import { transcription_config } from '../data/dictionary/transcription_config.module';
import { DictionaryError } from '../data/error/DictionaryError';
import { BackendProviderService } from './backend-provider.service';
import { ConsoleHideService } from './consoleHide.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { TestBed } from '@angular/core/testing';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  let consoleHideService: ConsoleHideService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ConfigurationService,
        BackendProviderService,
        { provide: ConsoleHideService, useValue: consoleHideService },
        { provide: ToastrService, useClass: ToastrService }, // Hier useClass verwenden
      ],
      imports: [ToastrModule.forRoot()],
    });

    service = TestBed.inject(ConfigurationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should generate a default dictionary on initialization', () => {
    expect(service.getDictionary()).toBeTruthy();
  });

  it('should update dictionary and notify subscribers', () => {
    const mockDictionary: dictionary = new dictionary(new transcription_config('de', [{ content: 'fest', sounds_like: ['test'] }]));
    service.updateDictionary(mockDictionary);

    service.dictionaryUpdated.subscribe((updatedDictionary) => {
      expect(updatedDictionary).toEqual(mockDictionary);
    });
  });

  it('should update dictionary correctly', () => {
    const newDictionary = new dictionary(new transcription_config('en', []));

    service.updateDictionary(newDictionary);

    expect(service.getDictionary()).toEqual(newDictionary);
  });

  it('should return current dictionary correctly', () => {
    const currentDictionary = service.getDictionary();

    expect(currentDictionary).toEqual(service.currentDictionary);
  });

  it('should update delay length correctly', () => {
    const newDelayLength = 5;

    service.updateDelayLength(newDelayLength);

    expect(service.getBufferLengthInMinutes()).toEqual(newDelayLength);
  });

  it('should return current delay length correctly', () => {
    const currentDelayLength = service.getBufferLengthInMinutes();

    expect(currentDelayLength).toEqual(service.delayLengthInMinutes);
  });

  it('should validate configuration correctly when valid', () => {
    service.updateDelayLength(5);
    service.updateDictionary(new dictionary(new transcription_config('de', [])));

    expect(() => service.isConfigValid()).not.toThrowMatching((e) => e instanceof Error);
  });

  it('should validate configuration correctly when  empty sounds_like with word', () => {
    service.updateDelayLength(5);
    service.updateDictionary(new dictionary(new transcription_config('de', [{ content: 'test', sounds_like: [''] }])));

    expect(() => service.isConfigValid()).not.toThrowMatching((e) => e instanceof Error);
  });

  it('should validate configuration correctly when empty word with sounds_like', () => {
    service.updateDelayLength(1);
    service.updateDictionary(
      new dictionary(new transcription_config('de', [{ content: '', sounds_like: ['test'] }])),
    );

    expect(() => service.isConfigValid()).toThrowMatching((e) => e instanceof DictionaryError);
  });

  it('should validate configuration correctly when invalid transcription_config', () => {
    service.updateDelayLength(0);
    service.updateDictionary(new dictionary(new transcription_config('', [])));

    expect(() => service.isConfigValid()).toThrowMatching((e) => e instanceof DictionaryError);
  });

  it('should validate configuration correctly when max entries exceeded', () => {
    const transcriptionConfig = new transcription_config('de', [
      { content: 'asdf', sounds_like: ['test'] },
    ]);
    for (let i = 0; i < 1001; i++) {
      transcriptionConfig.additional_vocab.push({
        content: 'asdf' + i,
        sounds_like: ['test' + i],
      });
    }

    const DICTIONARY = new dictionary(transcriptionConfig);
    service.updateDelayLength(2);
    service.updateDictionary(DICTIONARY);

    expect(() => service.isConfigValid()).toThrowMatching((e) => {
      return e instanceof DictionaryError && e.message === 'Maximale Anzahl an Wörterbucheinträgen überschritten (1000)!';
    });
  });

  it('should validate configuration correctly when buffer length invalid', () => {
    service.updateDelayLength(0);
    service.updateDictionary(new dictionary(new transcription_config('de', [])));

    expect(() => service.isConfigValid()).toThrowMatching((e) => {
      return e instanceof DictionaryError && e.message === 'Ungültige Buffer Länge!';
    });
  });

  it('should post configuration to backend', () => {
    const okResponse = new Response(null, { status: 200 });
    const fetchSpy = spyOn(window, 'fetch').and.resolveTo(okResponse);

    service.postConfigurationToBackend();

    expect(fetchSpy).toHaveBeenCalled();
  });
});