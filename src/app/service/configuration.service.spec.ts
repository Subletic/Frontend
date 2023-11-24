import {ConfigurationService} from "./configuration.service";
import {dictionary} from "../data/dictionary/dictionary.model";
import {transcription_config} from "../data/dictionary/transcription_config.module";

describe('ConfigurationService', () => {
  let service: ConfigurationService;
  beforeEach(() => {
    service = new ConfigurationService();
  });


  it('should update dictionary correctly', () => {
    const newDictionary = new dictionary(new transcription_config("en", []));

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
    service.updateDictionary(new dictionary(new transcription_config("en", [])));

    expect(service.isConfigValid()).toBeTrue();
  });

  it('should validate configuration correctly when invalid', () => {
    service.updateDelayLength(0);
    service.updateDictionary(new dictionary(new transcription_config("", [])));

    expect(service.isConfigValid()).toBeFalse();
  });

  it('should validate configuration correctly when empty word with sounds_like', () => {
    service.updateDelayLength(1);
    service.updateDictionary(new dictionary(new transcription_config("", [{content: "", sounds_like: ["test"]}])));

    expect(service.isConfigValid()).toBeFalse();
  });
});
