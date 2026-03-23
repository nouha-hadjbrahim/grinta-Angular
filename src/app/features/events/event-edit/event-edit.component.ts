import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../services/events/event.service';
import { GrintaEvent } from '../../../services/events/grinta-event.model';
import { AuthService } from '../../../services/User/auth.service';

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
      next: (data) => this.formEvent = data,
      error: () => alert('Event introuvable')
    });
  }

  saveEvent(): void {
    this.eventService.update(this.eventId, this.formEvent).subscribe({
      next: () => {
        alert('Événement modifié avec succès !');
        this.router.navigate(['/main/events']);
      },
      error: () => alert('Erreur lors de la modification')
    });
  }

  cancel(): void {
    this.router.navigate(['/main/events']);
  }
}