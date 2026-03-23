import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TableComponent } from './table.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [FormsModule, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter data on search', () => {
    component.data = [
      { id: '1', name: 'John' },
      { id: '2', name: 'Jane' }
    ];
    component.ngOnInit();
    component.onSearch('John');
    expect(component.filteredData.length).toBe(1);
  });

  it('should sort data', () => {
    component.data = [
      { id: '2', name: 'Jane' },
      { id: '1', name: 'John' }
    ];
    component.ngOnInit();
    component.onSort('name');
    expect(component.filteredData[0].name).toBe('Jane');
  });

  it('should emit action triggered', () => {
    spyOn(component.actionTriggered, 'emit');
    const item = { id: '1', name: 'John' };
    component.onAction('edit', item);
    expect(component.actionTriggered.emit).toHaveBeenCalledWith({
      action: 'edit',
      item
    });
  });
});
