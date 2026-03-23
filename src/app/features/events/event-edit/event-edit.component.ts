import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent, GrintaEventTag } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';
import { forkJoin, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-event-edit',
  templateUrl: './event-edit.component.html',
  styleUrls: ['./event-edit.component.css']
})
export class EventEditComponent implements OnInit {

  eventId!: number;
  formEvent: GrintaEvent = {
    title: '', name: '', date: '', time: '',
    location: '', description: '', maxParticipants: 0
  };

  errors: any = {};
  tags: GrintaEventTag[] = [];
  newTag: GrintaEventTag = { label: '', color: '#e63946' };
  tagError = '';

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
  }

  loadEvent(): void {
    this.eventService.getById(this.eventId).subscribe({
      next: (data) => {
        this.formEvent = data;
        this.tags = data.tags || [];
      },
      error: () => alert('Event introuvable')
    });
  }

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

  // ── Validation ───────────────────────────────
  validate(): boolean {
    this.errors = {};

    if (!this.formEvent.title?.trim()) {
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
    if (!this.formEvent.location?.trim()) {
      this.errors.location = 'Le lieu est obligatoire';
    }
    if (!this.formEvent.description?.trim()) {
      this.errors.description = 'La description est obligatoire';
    } else if (this.formEvent.description.trim().length < 20) {
      this.errors.description = 'La description doit contenir au moins 20 caractères';
    }
    if (!this.formEvent.maxParticipants || this.formEvent.maxParticipants < 1) {
      this.errors.maxParticipants = 'Le nombre de participants doit être supérieur à 0';
    }

    return Object.keys(this.errors).length === 0;
  }

  // ── Save avec gestion des tags (Version corrigée) ─────────────────
  saveEvent(): void {
    if (!this.validate()) return;

    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.formEvent.createdByUserId = userId;
    }

    // Récupérer les tags existants avant de faire la mise à jour
    this.eventService.getById(this.eventId).pipe(
      switchMap((existingEvent) => {
        const existingTags = existingEvent.tags || [];
        
        // 1. Mettre à jour l'événement
        return this.eventService.update(this.eventId, this.formEvent).pipe(
          switchMap(() => {
            const deleteObservables: Observable<void>[] = [];
            const addObservables: Observable<GrintaEventTag>[] = [];

            // Tags à supprimer (ceux qui existent mais ne sont plus dans la nouvelle liste)
            existingTags.forEach(existingTag => {
              const stillExists = this.tags.some(newTag => newTag.id === existingTag.id);
              if (!stillExists && existingTag.id) {
                deleteObservables.push(this.eventService.deleteTag(existingTag.id));
              }
            });

            // Tags à ajouter (ceux qui n'ont pas d'id - nouveaux tags)
            this.tags.forEach(newTag => {
              if (!newTag.id) {
                addObservables.push(this.eventService.addTag(this.eventId, newTag));
              }
            });

            // Exécuter toutes les opérations en parallèle
            return forkJoin([...deleteObservables, ...addObservables]);
          })
        );
      })
    ).subscribe({
      next: () => {
        alert('Événement modifié avec succès !');
        this.router.navigate(['/main/events']);
      },
      error: (err) => {
        console.error('Erreur:', err);
        alert('Erreur lors de la modification');
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/main/events']);
  }

  // Méthode utilitaire pour la couleur du texte
  isDarkColor(hex: string): boolean {
    if (!hex || !hex.startsWith('#')) return true;
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b);
    return luminance < 128;
  }
}