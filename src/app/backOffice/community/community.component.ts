import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../shared/services/community.service';
import { TableColumn, TableAction } from '../shared/components/table/table.component';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  createdDate: string;
  status: 'Active' | 'Inactive';
}

@Component({
  selector: 'app-community',
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent implements OnInit {
  communities: Community[] = [];
  
  columns: TableColumn[] = [
    { key: 'name', label: 'Community Name', sortable: true },
    { key: 'description', label: 'Description', sortable: false },
    { key: 'members', label: 'Members', sortable: true },
    { key: 'createdDate', label: 'Created Date', sortable: true },
    { key: 'status', label: 'Status', sortable: false }
  ];

  actions: TableAction[] = [
    { label: 'View', icon: 'bi-eye', action: 'view', color: '#0ea5e9' },
    { label: 'Edit', icon: 'bi-pencil', action: 'edit', color: '#f59e0b' },
    { label: 'Delete', icon: 'bi-trash', action: 'delete', color: '#ef4444' }
  ];

  constructor(private communityService: CommunityService) {}

  ngOnInit(): void {
    this.loadCommunities();
  }

  loadCommunities(): void {
    this.communityService.getCommunities().subscribe((data: any[]) => {
      this.communities = data;
    });
  }

  onAction(event: { action: string; item: Community }): void {
    switch (event.action) {
      case 'view':
        this.viewCommunity(event.item);
        break;
      case 'edit':
        this.editCommunity(event.item);
        break;
      case 'delete':
        this.deleteCommunity(event.item);
        break;
    }
  }

  viewCommunity(community: Community): void {
    alert(`Viewing community: ${community.name}`);
  }

  editCommunity(community: Community): void {
    alert(`Editing community: ${community.name}`);
  }

  deleteCommunity(community: Community): void {
    if (confirm(`Are you sure you want to delete ${community.name}?`)) {
      this.communityService.deleteCommunity(community.id).subscribe(() => {
        this.loadCommunities();
        alert('Community deleted successfully');
      });
    }
  }

  onAddNew(): void {
    alert('Add new community dialog would open here');
  }

  onSearch(searchTerm: string): void {
    console.log('Search:', searchTerm);
  }
}
