import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AdminEventService } from '../../../services/events/admin-event.service';
import { AuthService } from '../../../services/User/auth.service';
import { forkJoin } from 'rxjs';

interface GrintaEventTag {
  label: string;
  color: string;
}

@Component({
  selector: 'app-event-create-admin',
  templateUrl: './event-create-admin.component.html',
  styleUrls: ['./event-create-admin.component.css']
})
export class EventCreateAdminComponent {

  formEvent: any = {
    title: '',
    name: '',
    date: '',
    time: '',
    location: '',
    description: '',
    maxParticipants: 0
  };

  errors: any = {};
  tags: GrintaEventTag[] = [];
  newTag: GrintaEventTag = { label: '', color: '#e63946' };
  tagError = '';

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(
    private adminEventService: AdminEventService,
    private authService: AuthService,
    private router: Router
  ) {}

  addTag(): void {
    if (!this.newTag.label.trim()) {
      this.tagError = 'Le label du tag est obligatoire';
      return;
    }
    if (this.newTag.label.length > 20) {
      this.tagError = 'Le label ne doit pas dépasser 20 caractères';
      return;
    }
    if (this.tags.length >= 5) {
      this.tagError = 'Maximum 5 tags par événement';
      return;
    }
    if (this.tags.some(tag => tag.label.toLowerCase() === this.newTag.label.toLowerCase())) {
      this.tagError = 'Ce tag existe déjà';
      return;
    }
    this.tags.push({ ...this.newTag });
    this.newTag = { label: '', color: '#e63946' };
    this.tagError = '';
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  validate(): boolean {
    this.errors = {};

    if (!this.formEvent.title.trim()) {
      this.errors.title = 'Le titre est obligatoire';
    }
    if (this.formEvent.name && this.formEvent.name.length > 30) {
      this.errors.name = 'Le nom ne doit pas dépasser 30 caractères';
    }
    if (!this.formEvent.date) {
      this.errors.date = 'La date est obligatoire';
    } else if (this.formEvent.date < this.todayDate) {
      this.errors.date = 'La date ne peut pas être dans le passé';
    }
    if (!this.formEvent.time) {
      this.errors.time = "L'heure est obligatoire";
    }
    if (!this.formEvent.location.trim()) {
      this.errors.location = 'Le lieu est obligatoire';
    }
    if (!this.formEvent.description.trim()) {
      this.errors.description = 'La description est obligatoire';
    } else if (this.formEvent.description.trim().length < 20) {
      this.errors.description = 'La description doit contenir au moins 20 caractères';
    }
    if (!this.formEvent.maxParticipants || this.formEvent.maxParticipants < 1) {
      this.errors.maxParticipants = 'Le nombre de participants doit être supérieur à 0';
    }

    return Object.keys(this.errors).length === 0;
  }

  saveEvent(): void {
    if (!this.validate()) return;

    this.formEvent.createdByUserId = null;
    this.formEvent.createdByAdmin = true;

    // 1. Créer l'événement d'abord
    this.adminEventService.createEvent(this.formEvent).subscribe({
      next: (createdEvent) => {
        console.log('✅ Événement créé:', createdEvent);
        
        // 2. Ajouter les tags si existants
        if (this.tags.length > 0 && createdEvent.id) {
          const tagRequests = this.tags.map(tag =>
            this.adminEventService.addTag(createdEvent.id!, tag)
          );
          
          forkJoin(tagRequests).subscribe({
            next: (tags) => {
              console.log('✅ Tags ajoutés:', tags);
              alert('Événement créé avec succès !');
              this.router.navigate(['/admin/events']);
            },
            error: (err) => {
              console.error('❌ Error adding tags:', err);
              alert('Événement créé mais erreur lors de l\'ajout des tags');
              this.router.navigate(['/admin/events']);
            }
          });
        } else {
          alert('Événement créé avec succès !');
          this.router.navigate(['/admin/events']);
        }
      },
      error: (err) => {
        console.error('❌ Error creating event:', err);
        alert('Erreur lors de la création');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/events']);
  }

  isDarkColor(hex: string): boolean {
    if (!hex || !hex.startsWith('#')) return true;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }
}