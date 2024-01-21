import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-faq-page',
  templateUrl: './faq-page.component.html',
  styleUrls: ['./faq-page.component.scss']
})
export class FaqPageComponent {
  showFaq = false;

  toggleFaq() {
    this.showFaq = !this.showFaq;
  }
}
