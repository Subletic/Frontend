import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faq-button',
  templateUrl: './faq-button.component.html',
  styleUrls: ['./faq-button.component.scss']
})
export class FaqButtonComponent {

  constructor(
    private router: Router,
    ) {}

  toggleFaq(): void {
    const componentUrl = this.router.serializeUrl(
      this.router.createUrlTree(['/FAQ'])
    );
    
    window.open(componentUrl, '_blank');
  }
}
