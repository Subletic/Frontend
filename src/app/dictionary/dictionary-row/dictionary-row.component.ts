import { Component, Input } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';

@Component({
    selector: 'app-dictionary-row',
    templateUrl: './dictionary-row.component.html',
    styleUrls: ['./dictionary-row.component.scss'],
})
export class DictionaryRowComponent {

    @Input() rowData: additional_vocab;

    content_copy: string;

    sounds_like_copy: string[] | undefined;

    constructor() {

        this.rowData = new additional_vocab("gnocchi", ["nyohki", "nokey", "nochi"]);

        this.content_copy = this.rowData.content;

        if (!this.rowData.sounds_like) return;
        this.sounds_like_copy = this.rowData.sounds_like;

    }


    onWordColumnChange(event: any): void {
        this.rowData.content = event;
    }

    onContentChange(property: keyof additional_vocab, event: any): void {


        this.rowData[property] = event.target.innerText;

        if (property === 'sounds_like') {
            this.rowData[property] = event.target.innerText.split(',').map((value: string) => value.trim());
        }


        console.log(this.rowData.content);

        if (!this.rowData.sounds_like) return;
        console.log("Sounds_like: ");
        for (let i = 0; i < this.rowData.sounds_like.length; i++) {

            console.log(this.rowData.sounds_like[i]);
        }

    }

}