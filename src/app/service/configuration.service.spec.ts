import { ConfigurationService } from './configuration.service';
import { dictionary } from '../data/dictionary/dictionary.model';
import { transcription_config } from '../data/dictionary/transcription_config.module';
import { DictionaryError } from '../data/error/DictionaryError';
import { BackendProviderService } from './backend-provider.service';

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  beforeEach(() => {
    service = new ConfigurationService(new BackendProviderService());
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
    service.updateDictionary(
      new dictionary(new transcription_config('en', [])),
    );

    expect(() => service.isConfigValid()).not.toThrowMatching(
      (e) => e instanceof Error,
    );
  });

  it('should validate configuration correctly when invalid', () => {
    service.updateDelayLength(0);
    service.updateDictionary(new dictionary(new transcription_config('', [])));

    expect(() => service.isConfigValid()).toThrowMatching(
      (e) => e instanceof DictionaryError,
    );
  });

  it('should validate configuration correctly when empty word with sounds_like', () => {
    service.updateDelayLength(1);
    service.updateDictionary(
      new dictionary(
        new transcription_config('', [{ content: '', sounds_like: ['test'] }]),
      ),
    );

    expect(() => service.isConfigValid()).toThrowMatching(
      (e) => e instanceof DictionaryError,
    );
  });

  it('should post configuration to backend', () => {
    const okResponse = new Response(null, { status: 200 });
    const fetchSpy = spyOn(window, 'fetch').and.resolveTo(okResponse);

    service.postConfigurationToBackend();

    expect(fetchSpy).toHaveBeenCalled();
  });
});
