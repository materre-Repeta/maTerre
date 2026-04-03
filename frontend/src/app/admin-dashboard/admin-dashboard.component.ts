import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  stats: any = { totalUsers: 0, pendingAudits: 0, totalNotaries: 0 };
  pendingRequests: any[] = [];
  notaries: any[] = [];
  activeTab: 'AUDITS' | 'PROJECTS' | 'USERS' = 'AUDITS';
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadAdminData();
  }

  loadAdminData() {
    this.isLoading = true;
    // In prototype, mock admin data if API fails
    setTimeout(() => {
      this.stats = { totalUsers: 1250, pendingAudits: 14, totalNotaries: 45 };
      this.pendingRequests = [
        { id: 'req-101', titleNumber: 'Vol 45 Fol 12', requester: 'Paul Biya', date: '2024-03-28' },
        { id: 'req-102', titleNumber: 'Vol 89 Fol 04', requester: 'Samuel Etoo', date: '2024-03-30' }
      ];
      this.notaries = [
        { id: 'not-1', fullName: 'Me. Akere Muna' },
        { id: 'not-2', fullName: 'Me. Alice Nkom' }
      ];
      this.isLoading = false;
    }, 1000);
  }

  assignNotary(requestId: string, notaryId: string) {
    console.log(`Assigning request ${requestId} to notary ${notaryId}`);
    // Simulate API call
    this.pendingRequests = this.pendingRequests.filter(r => r.id !== requestId);
    alert('Notaire assign\u00e9 avec succ\u00e8s !');
  }
}
