import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';

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

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private router: Router
  ) {}

  validate(): boolean {
    this.errors = {};

    // Titre obligatoire
    if (!this.formEvent.title.trim()) {
      this.errors.title = 'Le titre est obligatoire';
    }

    // Nom max 30 caractères
    if (this.formEvent.name && this.formEvent.name.length > 30) {
      this.errors.name = 'Le nom ne doit pas dépasser 30 caractères';
    }

    // Date obligatoire et pas dans le passé
    if (!this.formEvent.date) {
      this.errors.date = 'La date est obligatoire';
    } else if (this.formEvent.date < this.todayDate) {
      this.errors.date = 'La date ne peut pas être dans le passé';
    }

    // Heure obligatoire
    if (!this.formEvent.time) {
      this.errors.time = "L'heure est obligatoire";
    }

    // Lieu obligatoire
    if (!this.formEvent.location.trim()) {
      this.errors.location = 'Le lieu est obligatoire';
    }

    // Description min 20 caractères
    if (!this.formEvent.description.trim()) {
      this.errors.description = 'La description est obligatoire';
    } else if (this.formEvent.description.trim().length < 20) {
      this.errors.description = 'La description doit contenir au moins 20 caractères';
    }

    // Max participants > 0
    if (!this.formEvent.maxParticipants || this.formEvent.maxParticipants < 1) {
      this.errors.maxParticipants = 'Le nombre de participants doit être supérieur à 0';
    }

    return Object.keys(this.errors).length === 0;
  }

  saveEvent(): void {
    if (!this.validate()) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) { alert('Vous devez être connecté !'); return; }

    this.formEvent.createdByUserId = userId;
    this.eventService.create(this.formEvent).subscribe({
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