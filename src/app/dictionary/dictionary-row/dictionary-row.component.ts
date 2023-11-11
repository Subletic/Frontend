import { Component, Input } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';

@Component({
    selector: 'app-dictionary-row',
    templateUrl: './dictionary-row.component.html',
    styleUrls: ['./dictionary-row.component.scss']
})
export class DictionaryRowComponent {
    @Input() rowData: additional_vocab;

    constructor() {

        this.rowData = new additional_vocab("gnocchi", ["nyohki", "nokey", "nochi"]);
    }


}
