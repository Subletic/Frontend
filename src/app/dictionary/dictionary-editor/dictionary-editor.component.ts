import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';
import { dictionary } from 'src/app/data/dictionary/dictionary.model';
import { DictionaryService } from 'src/app/service/dictionary.service';


/**
 * Components represents the dictionary-editor as a whole.
 */
@Component({
    selector: 'app-dictionary-editor',
    templateUrl: './dictionary-editor.component.html',
    styleUrls: ['./dictionary-editor.component.scss']
})
export class DictionaryEditorComponent implements OnInit {

    dictionary: dictionary;
    @Output() continueToEditorEvent = new EventEmitter<void>();

    alphabeticBoolean: boolean;

    constructor(private dictionaryService: DictionaryService) {

        this.dictionary = new dictionary({
            language: 'en',
            additional_vocab: [
                { content: '', sounds_like: [''] }
            ]
        });

        this.alphabeticBoolean = true;
    }

    ngOnInit(): void {
        this.dictionaryService.dictionaryUpdated.subscribe((updatedDictionary) => {
            this.dictionary = updatedDictionary;
        });
    }

    /**
     * Adds a new, blank row to the dictionary.
     */
    addRow(): void {
        this.dictionary.transcription_config.additional_vocab.push({ content: '', sounds_like: [''] });
        this.dictionaryService.updateDictionary(this.dictionary);
    }

    /**
     * Deletes given row from the dictionary.
     *
     * @param row - Row to be deleted.
     */
    onDeleteRow(row: additional_vocab): void {
        const index = this.dictionary.transcription_config.additional_vocab.indexOf(row);
        if (index !== -1) {
            this.dictionary.transcription_config.additional_vocab.splice(index, 1);
        }
        this.dictionaryService.updateDictionary(this.dictionary);
    }

    /**
     * Reacts to emitted 'changed row' and therefore updates dictionary service
     */
    onChangedRow(): void {
        this.dictionaryService.updateDictionary(this.dictionary);
    }

    /**
     * Makes call to let the dictionary be sorted alphabetically or
     * reverse alphabetically, depending on its current state.
     */
    sortAlphabeticallyCall(): void {

        if (this.alphabeticBoolean === true) {
            this.dictionary.sortAlphabetically();
            this.alphabeticBoolean = false;
        } else {
            this.dictionary.sortReverseAlphabetically();
            this.alphabeticBoolean = true;
        }
    }

    /**
     * Opens window for further explanation of the purpose of the dictionary.
     * Intended for users that do not yet know the function of the dictionary-process.
     */
    callHelp(): void {
        //Should call help window later
        console.log("Help is called!");
    }

    /**
     * Emits the continue event to the app-component.
     */
    continueToEditor(): void {
        this.dictionaryService.postDictionaryToBackend();
        this.continueToEditorEvent.emit();
    }

}
