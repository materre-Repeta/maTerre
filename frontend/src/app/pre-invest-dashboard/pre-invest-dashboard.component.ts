import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface EligibilityAnswer {
  question: string;
  options: { label: string; value: string; score: number }[];
  selected: string;
  icon: string;
}

@Component({
  selector: 'app-pre-invest-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pre-invest-dashboard.component.html',
  styleUrls: ['./pre-invest-dashboard.component.css']
})
export class PreInvestDashboardComponent implements OnInit {
  // Eligibility questionnaire
  currentStep = 0; // 0 = intro, 1-5 = questions, 6 = result
  questionIndex = 0;
  eligibilityScore = 0;
  isEligible = false;

  questions: EligibilityAnswer[] = [
    {
      question: 'Quel est le statut actuel de votre terrain ?',
      icon: '📋',
      options: [
        { label: 'Terrain coutumier (pas de titre)', value: 'coutumier', score: 3 },
        { label: 'Titre en cours d\'obtention au MINDCAF', value: 'en_cours', score: 4 },
        { label: 'Certificat de propriété expiré (>3 mois)', value: 'expire', score: 3 },
        { label: 'Je ne sais pas', value: 'unknown', score: 1 },
      ],
      selected: ''
    },
    {
      question: 'De quels documents disposez-vous ?',
      icon: '📑',
      options: [
        { label: 'Attestation coutumière + PV de palabre', value: 'complet', score: 4 },
        { label: 'Attestation coutumière uniquement', value: 'attestation', score: 3 },
        { label: 'Acte de vente simple', value: 'acte_vente', score: 2 },
        { label: 'Aucun document officiel', value: 'aucun', score: 0 },
      ],
      selected: ''
    },
    {
      question: 'Existe-t-il des conflits ou litiges connus sur ce terrain ?',
      icon: '⚖️',
      options: [
        { label: 'Aucun conflit connu', value: 'none', score: 4 },
        { label: 'Conflit réglé (PV signé)', value: 'resolved', score: 3 },
        { label: 'Conflit en cours avec un voisin', value: 'neighbor', score: 1 },
        { label: 'Litige familial ou successoral', value: 'family', score: 0 },
      ],
      selected: ''
    },
    {
      question: 'Quelle est la situation d\'occupation du terrain ?',
      icon: '🏗️',
      options: [
        { label: 'Terrain occupé par moi / ma famille', value: 'occupied', score: 4 },
        { label: 'Terrain cultivé (exploitation agricole)', value: 'cultivated', score: 3 },
        { label: 'Terrain vacant mais borné', value: 'vacant_borned', score: 3 },
        { label: 'Terrain vacant sans bornage', value: 'vacant', score: 2 },
      ],
      selected: ''
    },
    {
      question: 'Où est situé votre terrain ?',
      icon: '📍',
      options: [
        { label: 'Zone urbaine (Yaoundé, Douala, Bafoussam...)', value: 'urban', score: 4 },
        { label: 'Zone péri-urbaine', value: 'periurban', score: 3 },
        { label: 'Zone rurale accessible', value: 'rural', score: 2 },
        { label: 'Zone rurale enclavée', value: 'remote', score: 1 },
      ],
      selected: ''
    },
  ];

  // Location details (shown after eligibility)
  locationCity = '';
  locationQuarter = '';
  surface = 1000;

  // Simulator
  landValuePerM2 = 25000;
  titlingCostPerM2 = 5000;
  repaymentModel: 'LAND_PORTION' | 'SALE_COMMISSION' = 'LAND_PORTION';
  portionPercentage = 25;
  simulationResults: any = null;
  showSimulator = false;

  ngOnInit() {}

  startQuestionnaire() {
    this.currentStep = 1;
    this.questionIndex = 0;
    this.eligibilityScore = 0;
  }

  selectAnswer(questionIdx: number, value: string) {
    this.questions[questionIdx].selected = value;
  }

  nextQuestion() {
    if (this.questionIndex < this.questions.length - 1) {
      this.questionIndex++;
    } else {
      this.calculateEligibility();
    }
  }

  prevQuestion() {
    if (this.questionIndex > 0) {
      this.questionIndex--;
    }
  }

  calculateEligibility() {
    this.eligibilityScore = this.questions.reduce((sum, q) => {
      const opt = q.options.find(o => o.value === q.selected);
      return sum + (opt ? opt.score : 0);
    }, 0);

    const maxScore = this.questions.length * 4;
    const percentage = (this.eligibilityScore / maxScore) * 100;

    // Eligible if score >= 60% AND no blocking answer (score 0)
    const hasBlocker = this.questions.some(q => {
      const opt = q.options.find(o => o.value === q.selected);
      return opt && opt.score === 0;
    });

    this.isEligible = percentage >= 55 && !hasBlocker;
    this.currentStep = 6;
  }

  getScorePercentage(): number {
    const maxScore = this.questions.length * 4;
    return Math.round((this.eligibilityScore / maxScore) * 100);
  }

  getScoreLabel(): string {
    const pct = this.getScorePercentage();
    if (pct >= 80) return 'Excellent';
    if (pct >= 65) return 'Bon';
    if (pct >= 55) return 'Acceptable';
    return 'Insuffisant';
  }

  proceedToSimulator() {
    this.showSimulator = true;
    this.runSimulation();
  }

  runSimulation() {
    const totalCurrentValue = this.surface * this.landValuePerM2;
    const totalTitlingCost = this.surface * this.titlingCostPerM2;
    const valueMultiplier = 3;
    const totalTitledValue = totalCurrentValue * valueMultiplier;

    let maTerreShare = 0;
    if (this.repaymentModel === 'LAND_PORTION') {
      maTerreShare = (this.portionPercentage / 100) * totalTitledValue;
    } else {
      maTerreShare = totalTitlingCost + (totalTitledValue * 0.15);
    }
    const ownerShare = totalTitledValue - maTerreShare;

    this.simulationResults = {
      totalCurrentValue,
      totalTitlingCost,
      totalTitledValue,
      maTerreShare,
      ownerShare,
      netGain: ownerShare - totalCurrentValue
    };
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CM', { style: 'currency', currency: 'XAF', maximumFractionDigits: 0 }).format(amount);
  }
}
