import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-titling-tracker',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './titling-tracker.component.html',
  styleUrls: ['./titling-tracker.component.css']
})
export class TitlingTrackerComponent implements OnInit {
  requests: any[] = [];
  selectedRequest: any = null;
  logs: any[] = [];
  isLoading: boolean = true;

  steps = [
    { key: 'DOSSIER_SUBMITTED', label: 'Dépôt Dossier', icon: '📁' },
    { key: 'FIELD_SURVEY', label: 'Bornage / Géomètre', icon: '📍' },
    { key: 'PUBLIC_NOTICE', label: 'Publication Avis', icon: '📢' },
    { key: 'FINAL_REVIEW', label: 'Examen Final', icon: '⚖️' },
    { key: 'COMPLETED', label: 'Titre Signé', icon: '✍️' }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadRequests();
  }

  loadRequests() {
    // In prototype, use mock if API fails
    this.http.get<any[]>('http://localhost:8081/api/titling/my-requests').subscribe({
      next: (data) => {
        this.requests = data;
        if (this.requests.length > 0) this.selectRequest(this.requests[0]);
        this.isLoading = false;
      },
      error: () => {
        this.requests = [
          {
            id: 'tit-1',
            type: 'FULL_TITLING',
            propertyLocation: 'Yaoundé, Soa',
            surfaceArea: 1200,
            currentStep: 'FIELD_SURVEY',
            status: 'IN_PROGRESS'
          }
        ];
        this.selectRequest(this.requests[0]);
        this.isLoading = false;
      }
    });
  }

  selectRequest(request: any) {
    this.selectedRequest = request;
    this.loadLogs(request.id);
  }

  loadLogs(requestId: string) {
    this.http.get<any[]>(`http://localhost:8081/api/titling/logs/${requestId}`).subscribe({
      next: (data) => this.logs = data,
      error: () => {
        this.logs = [
          { step: 'FIELD_SURVEY', adminComment: 'Le géomètre a effectué la descente. Bornage validé par les voisins.', createdAt: new Date() },
          { step: 'DOSSIER_SUBMITTED', adminComment: 'Dossier complet déposé. Numéro de suivi MINDCAF: 2024/YX/45', createdAt: new Date(Date.now() - 86400000 * 5) }
        ];
      }
    });
  }

  isStepCompleted(stepKey: string): boolean {
    const currentIdx = this.steps.findIndex(s => s.key === this.selectedRequest?.currentStep);
    const stepIdx = this.steps.findIndex(s => s.key === stepKey);
    return stepIdx <= currentIdx;
  }

  isCurrentStep(stepKey: string): boolean {
    return this.selectedRequest?.currentStep === stepKey;
  }

  getProgressWidth(): string {
    const currentIdx = this.steps.findIndex(s => s.key === this.selectedRequest?.currentStep);
    const percent = currentIdx >= 0 ? (currentIdx / (this.steps.length - 1)) * 100 : 0;
    return percent + '%';
  }

  getStepLabel(stepKey: string): string {
    return this.steps.find(s => s.key === stepKey)?.label || stepKey;
  }

  getTypeLabel(type: string): string {
    return type === 'FULL_TITLING' ? 'Titrage Complet' : 'Certificat de Propriété';
  }

  getStatusLabel(status: string): string {
    return status === 'IN_PROGRESS' ? 'En Cours' : status === 'COMPLETED' ? 'Terminé' : status;
  }
}
