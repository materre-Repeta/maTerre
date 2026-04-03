import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VerificationService } from './verification.service';
import { AuthService } from './auth.service';
import { LoginComponent } from './login/login.component';
import { CatalogueComponent } from './catalogue/catalogue.component';
import { NotaryDashboardComponent } from './notary-dashboard/notary-dashboard.component';
import { TitlingTrackerComponent } from './titling-tracker/titling-tracker.component';
import { PreInvestDashboardComponent } from './pre-invest-dashboard/pre-invest-dashboard.component';
import { InvestmentMarketplaceComponent } from './investment-marketplace/investment-marketplace.component';
import { SubscriptionComponent } from './subscription/subscription.component';
import { InvestorDashboardComponent } from './investor-dashboard/investor-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

type ViewType = 'VERIFY' | 'CATALOGUE' | 'NOTARY' | 'TITRE' | 'PREINVEST' | 'COINVEST' | 'CLUB' | 'PORTFOLIO' | 'ADMIN';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule, FormsModule, LoginComponent, CatalogueComponent,
    NotaryDashboardComponent, TitlingTrackerComponent, PreInvestDashboardComponent,
    InvestmentMarketplaceComponent, SubscriptionComponent, InvestorDashboardComponent,
    AdminDashboardComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  titleNumber = '';
  isChecking = false;
  verificationResult: any = null;
  errorMessage = '';

  deferredPrompt: any;
  showInstallButton = false;
  mobileMenuOpen = false;
  headerScrolled = false;
  viewTransition = false;

  currentView: ViewType = 'VERIFY';
  showLogin = false;
  isLoggedIn = false;
  userRole = 'BUYER';

  // Interactive Cameroon map state
  hoveredCity: any = null;
  private scanInterval: any;
  private scanIndex = 0;
  scanningCity: any = null;

  // Cities positioned inside real Cameroon outline (viewBox 0 0 400 520)
  // Outline spans roughly x:33-368, y:10-510
  // Geo refs: Maroua ~10.6°N 14.3°E, Yaoundé ~3.9°N 11.5°E, Douala ~4.0°N 9.7°E
  cities: {
    name: string; x: number; y: number; title: string; status: 'GREEN' | 'RED' | 'YELLOW';
    notary: string; surface: number; checked: boolean; scanning: boolean;
  }[] = [
    { name: 'Maroua',     x: 278, y: 118, title: 'Vol 91 Fol 07', status: 'GREEN',  notary: 'Me. Abdoulaye D.',  surface: 1500, checked: false, scanning: false },
    { name: 'Garoua',     x: 262, y: 168, title: 'Vol 19 Fol 88', status: 'YELLOW', notary: 'Me. Hamidou S.',   surface: 950,  checked: false, scanning: false },
    { name: 'Ngaoundéré', x: 242, y: 235, title: 'Vol 34 Fol 19', status: 'GREEN',  notary: 'Me. Ousmanou B.',  surface: 2000, checked: false, scanning: false },
    { name: 'Bamenda',    x: 145, y: 308, title: 'Vol 45 Fol 56', status: 'GREEN',  notary: 'Me. Tabi N.',      surface: 800,  checked: false, scanning: false },
    { name: 'Bafoussam',  x: 168, y: 340, title: 'Vol 67 Fol 91', status: 'GREEN',  notary: 'Me. Tchatchoua P.', surface: 1200, checked: false, scanning: false },
    { name: 'Douala',     x: 120, y: 390, title: 'Vol 89 Fol 04', status: 'RED',    notary: 'Me. Etonde J.',    surface: 450,  checked: false, scanning: false },
    { name: 'Yaoundé',    x: 195, y: 385, title: 'Vol 56 Fol 12', status: 'GREEN',  notary: 'Me. Nkoulou R.',   surface: 600,  checked: false, scanning: false },
    { name: 'Bertoua',    x: 265, y: 365, title: 'Vol 78 Fol 42', status: 'GREEN',  notary: 'Me. Assiga L.',    surface: 3000, checked: false, scanning: false },
    { name: 'Kribi',      x: 108, y: 428, title: 'Vol 23 Fol 78', status: 'GREEN',  notary: 'Me. Mboua F.',     surface: 1200, checked: false, scanning: false },
    { name: 'Ebolowa',    x: 175, y: 460, title: 'Vol 55 Fol 63', status: 'YELLOW', notary: 'Me. Obiang C.',    surface: 700,  checked: false, scanning: false },
    { name: 'Limbé',      x: 95,  y: 375, title: 'Vol 12 Fol 33', status: 'GREEN',  notary: 'Me. Moliki A.',    surface: 350,  checked: false, scanning: false },
  ];

  // Network connections between cities (notary network lines)
  networkLines = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [5, 10],
    [6, 7], [6, 8], [6, 9], [5, 6], [2, 7], [8, 9],
  ];

  // Interactive chat
  chatMessages: { type: string; sender?: string; text: string; time?: string }[] = [
    { type: 'date', text: 'Aujourd\'hui' },
    { type: 'msg', sender: 'jp', text: 'Carine ! J\'ai enfin mon premier terrain !! Le titre est arrivé ce matin 🎉', time: '09:12' },
    { type: 'msg', sender: 'carine', text: 'Félicitations Jean-Pierre ! Tu as utilisé maTerre aussi ?', time: '09:14' },
    { type: 'msg', sender: 'jp', text: 'Oui ! Le notaire a vérifié le titre en 48h. Verdict VERT, tout clean. J\'ai pu signer sereinement.', time: '09:15' },
    { type: 'msg', sender: 'carine', text: 'Moi c\'est ma 4e acquisition sûre grâce à eux 💪 Je gère tout depuis Paris, zéro stress.', time: '09:16' },
    { type: 'msg', sender: 'jp', text: 'Depuis Paris ?! Comment tu fais pour les visites et tout ?', time: '09:17' },
    { type: 'msg', sender: 'carine', text: 'L\'app fait tout : vérification notariale, suivi du titrage au MINDCAF, et même le drone pour visiter le terrain à distance 🛰️', time: '09:18' },
    { type: 'msg', sender: 'jp', text: 'C\'est exactement ce qu\'il fallait au Cameroun. On ne se fait plus arnaquer.', time: '09:19' },
    { type: 'msg', sender: 'carine', text: 'La clé d\'un foncier sûr 🔐✨', time: '09:20' },
  ];
  visibleMessages: { type: string; sender?: string; text: string; time?: string }[] = [];
  isTyping = false;
  typingSender = 'jp';
  private chatInterval: any;
  private chatIndex = 0;

  navItems: { view: ViewType; label: string; icon: string; authOnly?: boolean; role?: string }[] = [
    { view: 'VERIFY', label: 'Vérifier', icon: '🔍' },
    { view: 'CATALOGUE', label: 'Acheter', icon: '🏠' },
    { view: 'TITRE', label: 'Titrer', icon: '📋' },
    { view: 'PREINVEST', label: 'Pré-Investir', icon: '💡' },
    { view: 'COINVEST', label: 'Co-Investir', icon: '🤝' },
    { view: 'PORTFOLIO', label: 'Portefeuille', icon: '📊', authOnly: true },
    { view: 'NOTARY', label: 'Missions', icon: '⚖️', authOnly: true, role: 'NOTARY' },
    { view: 'ADMIN', label: 'Admin', icon: '🛡️', authOnly: true, role: 'ADMIN' },
  ];

  constructor(
    private verificationService: VerificationService,
    public authService: AuthService
  ) {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.startScanAnimation();
    this.startChatAnimation();
  }

  ngOnDestroy() {
    if (this.scanInterval) clearInterval(this.scanInterval);
    if (this.chatInterval) clearTimeout(this.chatInterval);
  }

  startChatAnimation() {
    this.chatIndex = 0;
    this.visibleMessages = [];
    this.showNextMessage();
  }

  private showNextMessage() {
    if (this.chatIndex >= this.chatMessages.length) {
      // Pause then restart
      this.chatInterval = setTimeout(() => this.startChatAnimation(), 6000);
      return;
    }

    const msg = this.chatMessages[this.chatIndex];

    if (msg.type === 'date') {
      this.visibleMessages.push(msg);
      this.chatIndex++;
      this.chatInterval = setTimeout(() => this.showNextMessage(), 600);
      return;
    }

    // Show typing indicator
    this.isTyping = true;
    this.typingSender = msg.sender || 'jp';

    const typingDuration = 800 + Math.random() * 1000;
    this.chatInterval = setTimeout(() => {
      this.isTyping = false;
      this.visibleMessages.push(msg);
      this.chatIndex++;
      this.chatInterval = setTimeout(() => this.showNextMessage(), 500 + Math.random() * 700);
    }, typingDuration);
  }

  startScanAnimation() {
    // Scan cities one by one with a magnifying glass
    this.scanIndex = 0;
    this.scanInterval = setInterval(() => {
      if (this.scanIndex >= this.cities.length) {
        // All scanned — pause then restart
        clearInterval(this.scanInterval);
        setTimeout(() => {
          this.cities.forEach(c => { c.checked = false; c.scanning = false; });
          this.scanningCity = null;
          this.startScanAnimation();
        }, 4000);
        return;
      }
      // Mark previous as done scanning
      if (this.scanIndex > 0) {
        this.cities[this.scanIndex - 1].scanning = false;
      }
      // Scan current
      const city = this.cities[this.scanIndex];
      city.scanning = true;
      this.scanningCity = city;

      // After short delay, mark as checked
      setTimeout(() => {
        city.checked = true;
        city.scanning = false;
      }, 800);

      this.scanIndex++;
    }, 1400);
  }

  getCheckedCount(status: string): number {
    if (status === 'PENDING') return this.cities.filter(c => !c.checked).length;
    return this.cities.filter(c => c.checked && c.status === status).length;
  }

  getCityLine(lineIdx: number[]): string {
    const a = this.cities[lineIdx[0]];
    const b = this.cities[lineIdx[1]];
    return `M${a.x},${a.y} L${b.x},${b.y}`;
  }

  @HostListener('window:scroll')
  onScroll() {
    this.headerScrolled = window.scrollY > 20;
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onBeforeInstallPrompt(e: any) {
    e.preventDefault();
    this.deferredPrompt = e;
    this.showInstallButton = true;
  }

  navigate(view: ViewType) {
    if (this.currentView === view) return;
    this.viewTransition = true;
    setTimeout(() => {
      this.currentView = view;
      this.mobileMenuOpen = false;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => this.viewTransition = false, 50);
    }, 150);
  }

  isNavVisible(item: any): boolean {
    if (item.authOnly && !this.isLoggedIn) return false;
    if (item.role && this.userRole !== item.role) return false;
    return true;
  }

  onLoginSuccess() {
    this.showLogin = false;
    this.isLoggedIn = true;
    this.userRole = 'NOTARY';
  }

  logout() {
    this.authService.logout();
    this.isLoggedIn = false;
    this.userRole = 'BUYER';
    this.currentView = 'VERIFY';
  }

  installPwa() {
    if (!this.deferredPrompt) return;
    this.showInstallButton = false;
    this.deferredPrompt.prompt();
    this.deferredPrompt.userChoice.then((choiceResult: any) => {
      this.deferredPrompt = null;
    });
  }

  checkTitle() {
    if (!this.titleNumber) return;
    this.isChecking = true;
    this.verificationResult = null;
    this.errorMessage = '';

    this.verificationService.submitRequest(this.titleNumber).subscribe({
      next: () => {
        this.verificationService.getPropertyStatus(this.titleNumber).subscribe({
          next: (property) => {
            this.isChecking = false;
            this.verificationResult = {
              title: property.titleNumber,
              status: property.currentStatus,
              message: this.getVerdictMessage(property.currentStatus),
              date: new Date().toLocaleDateString('fr-FR')
            };
          },
          error: () => {
            this.isChecking = false;
            this.verificationResult = {
              title: this.titleNumber,
              status: 'PENDING',
              message: 'Vérification en cours. Votre rapport sera disponible sous 48h.',
              date: new Date().toLocaleDateString('fr-FR')
            };
          }
        });
      },
      error: () => {
        this.isChecking = false;
        this.errorMessage = 'Erreur lors de la soumission. Veuillez réessayer.';
      }
    });
  }

  downloadPdf() {
    if (!this.verificationResult?.id) return;
    this.verificationService.downloadReport(this.verificationResult.id).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Rapport_maTerre_${this.verificationResult.title}.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Download error:', err)
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'GREEN': return 'verdict-green';
      case 'RED': return 'verdict-red';
      case 'YELLOW': return 'verdict-yellow';
      default: return 'verdict-pending';
    }
  }

  private getVerdictMessage(status: string): string {
    switch (status) {
      case 'GREEN': return 'Titre foncier audité. Aucune charge détectée.';
      case 'RED': return 'ATTENTION : Litige foncier détecté sur ce titre.';
      case 'YELLOW': return 'PRUDENCE : Charges ou prénotations identifiées.';
      default: return 'Statut inconnu. Un arbitrage approfondi est nécessaire.';
    }
  }
}
