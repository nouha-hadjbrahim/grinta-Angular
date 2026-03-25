import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminEventService } from '../../../services/events/admin-event.service';
import { AuthService } from '../../../services/User/auth.service';
import { forkJoin } from 'rxjs';

interface GrintaEventTag {
  id?: number;
  label: string;
  color: string;
}

@Component({
  selector: 'app-event-edit-admin',
  templateUrl: './event-edit-admin.component.html',
  styleUrls: ['./event-edit-admin.component.css']
})
export class EventEditAdminComponent implements OnInit {

  eventId!: number;
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
  loading = false;

  get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private adminEventService: AdminEventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadEvent();
  }

  loadEvent(): void {
    this.loading = true;
    this.adminEventService.getEventById(this.eventId).subscribe({
      next: (data) => {
        this.formEvent = {
          id: data.id,
          title: data.title,
          name: data.name,
          date: data.date,
          time: data.time,
          location: data.location,
          description: data.description,
          maxParticipants: data.maxParticipants,
          status: data.status,
          createdByUserId: data.createdByUserId,
          createdByAdmin: data.createdByAdmin
        };
        this.tags = data.tags || [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading event:', err);
        alert('Événement introuvable');
        this.loading = false;
      }
    });
  }

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

  saveEvent(): void {
    if (!this.validate()) return;

    // Garder les informations admin
    this.formEvent.createdByAdmin = this.formEvent.createdByAdmin || false;

    // 1. Mettre à jour l'événement d'abord
    this.adminEventService.updateEvent(this.eventId, this.formEvent).subscribe({
      next: (updatedEvent) => {
        console.log('✅ Événement mis à jour:', updatedEvent);
        
        // 2. Gérer les tags
        if (this.tags.length > 0) {
          // Récupérer les tags existants pour savoir lesquels supprimer
          this.adminEventService.getEventById(this.eventId).subscribe({
            next: (currentEvent) => {
              const existingTags = currentEvent.tags || [];
              
              // Tags à supprimer (ceux qui existent mais ne sont plus dans la liste)
              const tagsToDelete = existingTags.filter(
                existing => !this.tags.some(newTag => newTag.id === existing.id)
              );
              
              // Tags à ajouter (ceux qui n'ont pas d'id)
              const tagsToAdd = this.tags.filter(newTag => !newTag.id);
              
              // Créer les observables pour les suppressions
              const deleteRequests = tagsToDelete.map(tag =>
                this.adminEventService.deleteTag(tag.id!)
              );
              
              // Créer les observables pour les ajouts
              const addRequests = tagsToAdd.map(tag =>
                this.adminEventService.addTag(this.eventId, tag)
              );
              
              // Exécuter toutes les opérations en parallèle
              forkJoin([...deleteRequests, ...addRequests]).subscribe({
                next: () => {
                  console.log('✅ Tags mis à jour');
                  alert('Événement modifié avec succès !');
                  this.router.navigate(['/admin/events']);
                },
                error: (err) => {
                  console.error('❌ Error updating tags:', err);
                  alert('Événement modifié mais erreur lors de la mise à jour des tags');
                  this.router.navigate(['/admin/events']);
                }
              });
            },
            error: (err) => {
              console.error('Error getting event tags:', err);
              alert('Événement modifié mais erreur lors de la récupération des tags');
              this.router.navigate(['/admin/events']);
            }
          });
        } else {
          // Si aucun tag, supprimer tous les tags existants
          this.adminEventService.getEventById(this.eventId).subscribe({
            next: (currentEvent) => {
              const existingTags = currentEvent.tags || [];
              const deleteRequests = existingTags.map(tag =>
                this.adminEventService.deleteTag(tag.id!)
              );
              
              if (deleteRequests.length > 0) {
                forkJoin(deleteRequests).subscribe({
                  next: () => {
                    console.log('✅ Tous les tags supprimés');
                    alert('Événement modifié avec succès !');
                    this.router.navigate(['/admin/events']);
                  },
                  error: (err) => {
                    console.error('Error deleting tags:', err);
                    alert('Événement modifié');
                    this.router.navigate(['/admin/events']);
                  }
                });
              } else {
                alert('Événement modifié avec succès !');
                this.router.navigate(['/admin/events']);
              }
            }
          });
        }
      },
      error: (err) => {
        console.error('❌ Error updating event:', err);
        alert('Erreur lors de la modification');
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