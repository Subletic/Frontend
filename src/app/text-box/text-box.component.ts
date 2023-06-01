import {Component, OnInit} from '@angular/core';
import {SignalRService} from "../service/signalRService";

@Component({
  selector: 'app-text-box',
  templateUrl: './text-box.component.html',
  styleUrls: ['./text-box.component.css']
})
export class TextBoxComponent implements OnInit {
  receivedMessage = "";

  constructor(private signalRService: SignalRService) {
  }

  ngOnInit() {
    this.signalRService.receivedMessage.subscribe((message: string) => {
      this.receivedMessage = message;
    })
  }

}
