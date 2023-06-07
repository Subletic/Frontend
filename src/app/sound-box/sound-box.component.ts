

import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sound-box',
  templateUrl: './sound-box.component.html',
  styleUrls: ['./sound-box.component.scss']
})
export class SoundBoxComponent {
  constructor(private router: Router) { }

  handleButtonClick() {
    console.log("hallo");
    this.router.navigate(['/weitereSeite']);
  }
}


