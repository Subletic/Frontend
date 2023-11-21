import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DictionaryRowComponent } from './dictionary-row.component';
import { additional_vocab } from 'src/app/data/dictionary/additionalVocab.model';

describe('DictionaryRowComponent', () => {
    let component: DictionaryRowComponent;
    let fixture: ComponentFixture<DictionaryRowComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            declarations: [DictionaryRowComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(DictionaryRowComponent);
        component = fixture.componentInstance;
        component.rowData = new additional_vocab('', ['']);
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit deleteRow event when onDeleteRow is called', () => {
        const spy = spyOn(component.deleteRow, 'emit');
        component.onDeleteRow();
        expect(spy).toHaveBeenCalled();
    });

    it('should update rowData on onContentChange', () => {
        const contentChangeEvent = new Event('input');
        const contentDiv = document.createElement('div');
        contentDiv.textContent = 'Test Content';

        spyOnProperty(contentChangeEvent, 'target', 'get').and.returnValue(contentDiv);

        component.onContentChange('content', contentChangeEvent);
        expect(component.rowData.content).toBe('Test Content');
    });

    it('should emit deleteRow event when delete button is clicked', () => {
        const spy = spyOn(component.deleteRow, 'emit');
        const deleteButton = fixture.nativeElement.querySelector('.delete-button');
        deleteButton.click();
        expect(spy).toHaveBeenCalled();
    });
});
