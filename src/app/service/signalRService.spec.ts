import { SignalRService } from './signalRService';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { SpeechBubbleExport } from '../data/speechBubble.model';

describe('SignalRService', () => {
  let service: SignalRService;
  let hubConnectionBuilderSpy: jasmine.SpyObj<signalR.HubConnectionBuilder>;
  let hubConnectionSpy: jasmine.SpyObj<signalR.HubConnection>;

  beforeEach(() => {
    hubConnectionBuilderSpy = jasmine.createSpyObj('HubConnectionBuilder', ['withUrl', 'build']);
    hubConnectionSpy = jasmine.createSpyObj('HubConnection', ['start', 'on', 'stream']);
    hubConnectionBuilderSpy.withUrl.and.returnValue(hubConnectionBuilderSpy);
    hubConnectionBuilderSpy.build.and.returnValue(hubConnectionSpy);

    spyOn(console, 'log');
    spyOn(console, 'error');

    service = new SignalRService();
  });

  it('should create SignalRService', () => {
    expect(service).toBeTruthy();
  });

  it('should start hub connection', (done) => {
    hubConnectionSpy.start.and.resolveTo();

    service = new SignalRService();

    expect(hubConnectionSpy.start).toHaveBeenCalled();

    hubConnectionSpy.start.calls.mostRecent().returnValue.then(() => {
      expect(console.log).toHaveBeenCalledWith('SignalR connected.');
      done();
    });
  });

  it('should log error when hub connection fails to start', (done) => {
    const error = 'Connection error';
    hubConnectionSpy.start.and.rejectWith(error);

    service = new SignalRService();

    expect(hubConnectionSpy.start).toHaveBeenCalled();

    hubConnectionSpy.start.calls.mostRecent().returnValue.catch(() => {
      expect(console.error).toHaveBeenCalledWith('SignalR connection error: ', error);
      done();
    });
  });

  it('should subscribe to "newBubble" event', () => {
    const speechBubble: SpeechBubbleExport[] = [
      new SpeechBubbleExport(1, 1, 1, 1, []),
      new SpeechBubbleExport(2, 2, 2, 2, []),
      new SpeechBubbleExport(3, 3, 3, 3, [])
    ];
    const subject = new Subject<SpeechBubbleExport[]>();
    hubConnectionSpy.on.and.callFake((eventName, callback) => {
      if (eventName === 'newBubble') {
        callback(speechBubble);
      }
    });
    spyOn(service.newBubbleReceived, 'next');
  
    expect(service.newBubbleReceived.next).not.toHaveBeenCalled();
  
    subject.next(speechBubble);
  
    expect(service.newBubbleReceived.next).toHaveBeenCalledWith(speechBubble);
    expect(console.log).toHaveBeenCalledWith('Neue SpeechBubble erhalten:', speechBubble);
  });
  
  

  it('should subscribe to "deleteBubble" event', () => {
    const id = 1;
    const subject = new Subject<number>();
    hubConnectionSpy.on.and.callFake((eventName, callback) => {
      if (eventName === 'deleteBubble') {
        callback(id);
      }
    });
    spyOn(service.oldBubbledeleted, 'next');
  
    expect(service.oldBubbledeleted.next).not.toHaveBeenCalled();
  
    subject.next(id);
  
    expect(service.oldBubbledeleted.next).toHaveBeenCalledWith(id);
    expect(console.log).toHaveBeenCalledWith('Alte SpeechBubble gelöscht:', id);
  });
  
});