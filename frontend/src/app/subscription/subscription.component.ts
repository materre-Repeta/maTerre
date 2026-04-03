import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.css']
})
export class SubscriptionComponent {
  plans = [
    {
      name: 'GRATUIT',
      price: '0 FCFA',
      period: '',
      features: [
        { text: 'Consultation catalogue public', included: true },
        { text: 'Demande d\'audit notarial', included: true },
        { text: 'Suivi de dossier basique', included: true },
        { text: 'Accès prioritaire aux projets', included: false },
        { text: 'Newsletter tendances fonci\u00e8res', included: false }
      ],
      btnText: 'Plan Actuel',
      level: 'FREE',
      highlight: false
    },
    {
      name: 'CLUB maTerre',
      price: '5 000 FCFA',
      period: '/ mois',
      features: [
        { text: 'Acc\u00e8s Prioritaire 48h aux projets', included: true },
        { text: 'R\u00e9duction 5% sur les audits', included: true },
        { text: 'Newsletter tendances fonci\u00e8res', included: true },
        { text: 'Conciergerie WhatsApp d\u00e9di\u00e9e', included: false },
        { text: 'Visites Drone en direct', included: false }
      ],
      btnText: 'Devenir Membre',
      level: 'PREMIUM',
      highlight: true
    },
    {
      name: 'ELITE DIASPORA',
      price: '25 000 FCFA',
      period: '/ mois',
      features: [
        { text: 'Conciergerie WhatsApp d\u00e9di\u00e9e', included: true },
        { text: 'Visites Drone en direct', included: true },
        { text: 'Conseiller juridique personnel', included: true },
        { text: 'Acc\u00e8s projets Haute-Plus-Value', included: true },
        { text: 'Tout le Club maTerre inclus', included: true }
      ],
      btnText: 'Rejoindre l\'Elite',
      level: 'ELITE',
      highlight: false
    }
  ];

  selectPlan(level: string) {
    console.log(`Plan selected: ${level}`);
    // TODO: integrate with payment / subscription API
  }
}
