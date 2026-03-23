import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';

export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

export interface TableAction {
  label: string;
  icon: string;
  action: 'view' | 'edit' | 'delete';
  color?: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements OnInit, OnChanges {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() title: string = '';
  @Input() showAddButton: boolean = true;

  @Output() actionTriggered = new EventEmitter<{ action: string; item: any }>();
  @Output() addNew = new EventEmitter<void>();
  @Output() search = new EventEmitter<string>();

  searchTerm: string = '';
  filteredData: any[] = [];
  sortColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  ngOnInit(): void {
    this.filteredData = [...this.data];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.applyFilter();
    }
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.search.emit(term);
    this.applyFilter();
  }

  applyFilter(): void {
    this.filteredData = this.data.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );
  }

  onSort(columnKey: string): void {
    if (this.sortColumn === columnKey) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = columnKey;
      this.sortDirection = 'asc';
    }

    this.filteredData.sort((a, b) => {
      const aValue = a[columnKey];
      const bValue = b[columnKey];

      if (aValue < bValue) {
        return this.sortDirection === 'asc' ? -1 : 1;
      } else if (aValue > bValue) {
        return this.sortDirection === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }

  onAction(actionType: string, item: any): void {
    this.actionTriggered.emit({ action: actionType, item });
  }

  onAddNew(): void {
    this.addNew.emit();
  }

  getSortIcon(columnKey: string): string {
    if (this.sortColumn !== columnKey) {
      return 'bi-arrow-down-up';
    }
    return this.sortDirection === 'asc' ? 'bi-arrow-up' : 'bi-arrow-down';
  }
}
