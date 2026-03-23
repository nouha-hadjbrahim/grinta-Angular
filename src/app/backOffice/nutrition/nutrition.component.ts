import { Component, OnInit } from '@angular/core';
import { NutritionService } from '../shared/services/nutrition.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Nutrition {
  id: string;
  name: string;
  nutritionist: string;
  type: 'Plan' | 'Recipe' | 'Meal';
  calories: number;
  createdDate: string;
}

@Component({
  selector: 'app-nutrition',
  templateUrl: './nutrition.component.html',
  styleUrls: ['./nutrition.component.css']
})
export class NutritionComponent implements OnInit {
  nutritions: Nutrition[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', label: 'Nutrition Name', sortable: true },
    { key: 'nutritionist', label: 'Nutritionist', sortable: true },
    { key: 'type', label: 'Type', sortable: false },
    { key: 'calories', label: 'Calories', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(private nutritionService: NutritionService) {}

  ngOnInit(): void {
    this.loadNutritions();
  }

  loadNutritions(): void {
    this.nutritionService.getNutritions().subscribe((data: any[]) => {
      this.nutritions = data;
    });
  }

  onAction(event: { action: string; item: Nutrition }): void {
    switch (event.action) {
      case 'view':
        this.viewNutrition(event.item);
        break;
      case 'edit':
        this.editNutrition(event.item);
        break;
      case 'delete':
        this.deleteNutrition(event.item);
        break;
    }
  }

  viewNutrition(nutrition: Nutrition): void {
    alert(`Viewing nutrition: ${nutrition.name}`);
  }

  editNutrition(nutrition: Nutrition): void {
    alert(`Editing nutrition: ${nutrition.name}`);
  }

  deleteNutrition(nutrition: Nutrition): void {
    if (confirm(`Are you sure you want to delete ${nutrition.name}?`)) {
      this.nutritionService.deleteNutrition(nutrition.id).subscribe(() => {
        this.loadNutritions();
        alert('Nutrition deleted successfully');
      });
    }
  }

  onAddNew(): void {
    alert('Add new nutrition dialog would open here');
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }
}
