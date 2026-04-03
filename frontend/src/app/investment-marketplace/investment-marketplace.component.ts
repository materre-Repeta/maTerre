import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-investment-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-marketplace.component.html',
  styleUrls: ['./investment-marketplace.component.css']
})
export class InvestmentMarketplaceComponent implements OnInit {
  projects: any[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.http.get<any[]>('http://localhost:8081/api/investment/open-projects').subscribe({
      next: (data) => {
        this.projects = data;
        this.isLoading = false;
      },
      error: () => {
        this.projects = [
          {
            id: 'proj-1',
            location: 'Kribi - Bord de Mer',
            locationDetail: 'Chutes de la Lobe',
            surfaceArea: 2500,
            totalFundingNeeded: 3500000,
            currentFundingRaised: 2100000,
            totalLandPortionToShare: 30,
            riskLevel: 'GREEN',
            estimatedRoi: 35,
            isExclusive: false,
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&w=800'
          },
          {
            id: 'proj-2',
            location: 'Yaounde - Febe Village',
            locationDetail: 'Vue Panoramique',
            surfaceArea: 1500,
            totalFundingNeeded: 1800000,
            currentFundingRaised: 450000,
            totalLandPortionToShare: 25,
            riskLevel: 'GREEN',
            estimatedRoi: 42,
            isExclusive: true,
            imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800'
          },
          {
            id: 'proj-3',
            location: 'Douala - Lendi',
            locationDetail: 'Extension Residentielle',
            surfaceArea: 5000,
            totalFundingNeeded: 12000000,
            currentFundingRaised: 9500000,
            totalLandPortionToShare: 35,
            riskLevel: 'GREEN',
            estimatedRoi: 28,
            isExclusive: false,
            imageUrl: 'https://images.unsplash.com/photo-1500382017468-9049fee74a62?auto=format&fit=crop&w=800'
          }
        ];
        this.isLoading = false;
      }
    });
  }

  getFundingPercentage(project: any): number {
    return (project.currentFundingRaised / project.totalFundingNeeded) * 100;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF' }).format(amount);
  }
}
