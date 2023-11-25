import { Component } from '@angular/core'

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    showDictionary = true
    title = 'Frontend'

    onContinueToEditor(): void {
        this.showDictionary = false
    }
}
