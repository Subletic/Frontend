import { dictionary } from '../dictionary/dictionary.model';

export class Config {
  public dictionary: dictionary;
  public delayLength: number;

  constructor(dictionary: dictionary, delayLength: number) {
    this.dictionary = dictionary;
    this.delayLength = delayLength;
  }
}
