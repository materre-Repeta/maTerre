import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationService } from '../verification.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-notary-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notary-dashboard.component.html',
  styleUrls: ['./notary-dashboard.component.css']
})
export class NotaryDashboardComponent implements OnInit {
  assignedRequests: any[] = [];
  notaryProfile: any = null;
  isLoading: boolean = true;

  constructor(
    private verificationService: VerificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    // In prototype, mock notary data
    this.notaryProfile = {
      fullName: 'Me. Jean Notaire',
      totalCommissionsEarned: 145000, // XAF
      mobileMoneyNumber: '677 00 00 00',
      missionsCompleted: 23,
      averageRating: 4.8
    };

    // Mock assigned requests
    this.assignedRequests = [
      { id: 'req_1', titleNumber: 'Vol 45 Fol 12', location: 'Yaoundé', status: 'ASSIGNED', fee: 10000 },
      { id: 'req_2', titleNumber: 'Vol 89 Fol 04', location: 'Douala', status: 'ASSIGNED', fee: 10000 }
    ];
    this.isLoading = false;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(amount);
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name.replace('Me. ', '').split(' ').map(w => w[0]).join('').toUpperCase();
  }
}
