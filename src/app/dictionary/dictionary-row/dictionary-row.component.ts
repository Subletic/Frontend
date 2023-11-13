import { AfterViewInit, Component, Input, EventEmitter, Output } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';

@Component({
    selector: 'app-dictionary-row',
    templateUrl: './dictionary-row.component.html',
    styleUrls: ['./dictionary-row.component.scss'],
})
export class DictionaryRowComponent implements AfterViewInit {

    @Input() rowData: additional_vocab;
    @Output() deleteRow: EventEmitter<void> = new EventEmitter<void>();

    content_copy: string | undefined;

    sounds_like_copy: string[] | undefined;

    constructor() {

        this.rowData = new additional_vocab("", [""]);

        this.content_copy = this.rowData.content;

        if (!this.rowData.sounds_like) return;
        this.sounds_like_copy = this.rowData.sounds_like;

    }

    ngAfterViewInit(): void {
        this.content_copy = this.rowData.content;

        if (!this.rowData.sounds_like) return;
        this.sounds_like_copy = this.rowData.sounds_like;
    }


    onWordColumnChange(event: any): void {
        this.rowData.content = event;
    }

    onContentChange(property: keyof additional_vocab, event: any): void {


        this.rowData[property] = event.target.textContent;

        if (property === 'sounds_like') {
            this.rowData[property] = event.target.textContent.split(',').map((value: string) => value.trim());
        }

        //Ausgabentest:
        console.log(this.rowData.content);
        if (!this.rowData.sounds_like) return;
        console.log("Sounds_like: ");
        for (let i = 0; i < this.rowData.sounds_like.length; i++) {

            console.log(this.rowData.sounds_like[i]);
        }
    }

    onDeleteRow(): void {
        this.deleteRow.emit();
    }

}