import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertyService } from '../property.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.css']
})
export class CatalogueComponent implements OnInit {
  properties: any[] = [];
  isLoading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit() {
    this.propertyService.getCertifiedProperties().subscribe({
      next: (data) => {
        this.properties = data;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.properties = [
          {
            id: '1',
            titleNumber: 'Vol 45 Fol 12',
            locationCity: 'Yaoundé',
            locationQuarter: 'Bastos',
            surfaceArea: 500,
            price: 45000000,
            description: 'Terrain titré dans une zone résidentielle sécurisée.'
          },
          {
            id: '2',
            titleNumber: 'Vol 89 Fol 04',
            locationCity: 'Douala',
            locationQuarter: 'Bonapriso',
            surfaceArea: 1000,
            price: 68000000,
            description: 'Idéal pour projet immobilier de luxe.'
          }
        ];
      }
    });
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('fr-CM', {
      style: 'currency',
      currency: 'XAF',
      maximumFractionDigits: 0
    }).format(price);
  }

  getInitials(property: any): string {
    const city = property.locationCity || '';
    const quarter = property.locationQuarter || '';
    return (city.charAt(0) + quarter.charAt(0)).toUpperCase();
  }

  getGradient(index: number): string {
    const gradients = [
      'linear-gradient(135deg, #1B4332 0%, #2D6A4F 40%, #40916C 100%)',
      'linear-gradient(135deg, #0D2818 0%, #1B4332 40%, #2D6A4F 100%)',
      'linear-gradient(135deg, #2D6A4F 0%, #1B4332 50%, #D4A017 100%)',
      'linear-gradient(135deg, #1A1A2E 0%, #1B4332 60%, #95D5B2 100%)'
    ];
    return gradients[index % gradients.length];
  }
}
