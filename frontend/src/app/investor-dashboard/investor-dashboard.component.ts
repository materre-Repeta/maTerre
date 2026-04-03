import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-investor-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './investor-dashboard.component.html',
  styleUrls: ['./investor-dashboard.component.css']
})
export class InvestorDashboardComponent implements OnInit {
  myInvestments: any[] = [];
  stats: any = {
    totalInvested: 0,
    totalM2Owned: 0,
    estimatedValuation: 0,
    projectsCount: 0
  };
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadPortfolio();
  }

  loadPortfolio() {
    setTimeout(() => {
      this.myInvestments = [
        {
          id: 'inv-1',
          location: 'Kribi - Chutes de la Lobe',
          amountInvested: 500000,
          m2Equivalent: 75,
          currentStep: 'FIELD_SURVEY',
          progress: 40,
          status: 'ACTIVE',
          estimatedGain: 450000,
          imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&w=400'
        },
        {
          id: 'inv-2',
          location: 'Yaounde - Febe Village',
          amountInvested: 250000,
          m2Equivalent: 30,
          currentStep: 'DOSSIER_SUBMITTED',
          progress: 20,
          status: 'ACTIVE',
          estimatedGain: 175000,
          imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400'
        }
      ];

      this.calculateStats();
      this.isLoading = false;
    }, 1000);
  }

  calculateStats() {
    this.stats.totalInvested = this.myInvestments.reduce((acc, inv) => acc + inv.amountInvested, 0);
    this.stats.totalM2Owned = this.myInvestments.reduce((acc, inv) => acc + inv.m2Equivalent, 0);
    this.stats.projectsCount = this.myInvestments.length;
    this.stats.estimatedValuation = this.stats.totalInvested + this.myInvestments.reduce((acc, inv) => acc + inv.estimatedGain, 0);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(amount);
  }

  getStepLabel(step: string): string {
    const steps: any = {
      'DOSSIER_SUBMITTED': 'Dossier depose',
      'FIELD_SURVEY': 'Bornage en cours',
      'PUBLIC_NOTICE': 'Publication Avis',
      'FINAL_REVIEW': 'Examen Final',
      'COMPLETED': 'Titre Signe'
    };
    return steps[step] || step;
  }

  getGainPercentage(): number {
    if (this.stats.totalInvested === 0) return 0;
    return ((this.stats.estimatedValuation - this.stats.totalInvested) / this.stats.totalInvested) * 100;
  }
}
