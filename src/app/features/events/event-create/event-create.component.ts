import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent, GrintaEventTag } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';
import { forkJoin, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {

  formEvent: GrintaEvent = {
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
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  // ── Tags ─────────────────────────────────────
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
    this.tags.push({ ...this.newTag });
    this.newTag = { label: '', color: '#e63946' };
    this.tagError = '';
  }

  removeTag(index: number): void {
    this.tags.splice(index, 1);
  }

  // ── Validation ───────────────────────────────
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

  // ── Save ─────────────────────────────────────
  saveEvent(): void {
    if (!this.validate()) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) { alert('Vous devez être connecté !'); return; }

    this.formEvent.createdByUserId = userId;

    this.eventService.create(this.formEvent).pipe(
      switchMap((createdEvent) => {
        if (this.tags.length > 0 && createdEvent.id) {
          const tagObservables = this.tags.map(tag =>
            this.eventService.addTag(createdEvent.id!, tag)
          );
          return forkJoin(tagObservables);
        }
        return of([]);
      })
    ).subscribe({
      next: () => {
        alert('Événement créé avec succès !');
        this.router.navigate(['/main/events']);
      },
      error: () => alert('Erreur lors de la création')
    });
  }

  cancel(): void {
    this.router.navigate(['/main/events']);
  }
}