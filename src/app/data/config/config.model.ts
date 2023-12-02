import {transcription_config} from "../dictionary/transcription_config.module";

export class Config {
  public dictionary: transcription_config;
  public delayLength: number;

  constructor(dictionary: transcription_config, delayLength: number) {
    this.dictionary = dictionary;
    this.delayLength = delayLength;
  }
}
