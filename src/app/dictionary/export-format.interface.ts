import { dictionary } from "../data/dictionary/dictionary.model";

export interface ExportFormat {
    download(fileName: string, dictionary: dictionary): void;
}

export class JsonExport implements ExportFormat {
    download(fileName: string, dictionary: dictionary): void {
        const DICTIONARY_STRING = JSON.stringify(dictionary, null, 2);

        const BLOB = new Blob([DICTIONARY_STRING], { type: "application/json" })
        const link = document.createElement('a');

        link.href = window.URL.createObjectURL(BLOB);
        link.download = fileName === "" ? "dictionary" : `${fileName}`;
        link.click();
        URL.revokeObjectURL(link.href);
    }
}

export class CsvExport implements ExportFormat {
    download(fileName: string, dictionary: dictionary): void {
        const CSV_CONTENT = this.convertDictionaryToCSV(dictionary);
        const BLOB = new Blob([CSV_CONTENT], { type: "text/csv" });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(BLOB);
        link.download = fileName === "" ? "dictionary" : `${fileName}`;
        link.click();

        URL.revokeObjectURL(link.href);
    }

    /**
     * Converts the dictionary to a CSV-formatted string.
     * @param dictionary Dictionary to convert
     * @returns CSV-formatted string
     */
    private convertDictionaryToCSV(dictionary: dictionary): string {
        const rows: string[] = [];

        const dataRows = dictionary.transcription_config.additional_vocab.map((vocabItem) => {
            const content = vocabItem.content || '';
            const soundsLike = vocabItem.sounds_like ? vocabItem.sounds_like.join(';') : '';
            return [content, soundsLike].join(';');
        });

        rows.push(...dataRows);

        return rows.join('\n');
    }

}