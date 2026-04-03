import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  @Output() loginSuccess = new EventEmitter<void>();

  phoneNumber: string = '';
  otp: string = '';
  otpDigits: string[] = ['', '', '', '', '', ''];
  step: 'PHONE' | 'OTP' = 'PHONE';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private authService: AuthService) {}

  onOtpDigitInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    if (value && !/^\d$/.test(value)) {
      input.value = '';
      this.otpDigits[index] = '';
      return;
    }

    this.otpDigits[index] = value;
    this.otp = this.otpDigits.join('');

    // Auto-focus next input
    if (value && index < 5) {
      const next = input.parentElement?.querySelector(
        `input:nth-child(${index + 2})`
      ) as HTMLInputElement;
      next?.focus();
    }
  }

  onOtpKeydown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prev = input.parentElement?.querySelector(
        `input:nth-child(${index})`
      ) as HTMLInputElement;
      prev?.focus();
    }
  }

  onOtpPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pasted = event.clipboardData?.getData('text')?.replace(/\D/g, '').slice(0, 6) || '';
    for (let i = 0; i < 6; i++) {
      this.otpDigits[i] = pasted[i] || '';
    }
    this.otp = this.otpDigits.join('');
  }

  sendOtp() {
    if (!this.phoneNumber) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.sendOtp(this.phoneNumber).subscribe({
      next: () => {
        this.isLoading = false;
        this.step = 'OTP';
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Erreur d'envoi. Vérifiez le numéro.";
      }
    });
  }

  verifyOtp() {
    if (!this.otp || this.otp.length < 6) return;
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.verifyOtp(this.phoneNumber, this.otp).subscribe({
      next: () => {
        this.isLoading = false;
        this.loginSuccess.emit();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = "Code incorrect. Réessayez.";
      }
    });
  }

  reset() {
    this.step = 'PHONE';
    this.otp = '';
    this.otpDigits = ['', '', '', '', '', ''];
    this.errorMessage = '';
  }
}
