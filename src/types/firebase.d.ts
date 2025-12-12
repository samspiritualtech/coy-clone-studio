import { RecaptchaVerifier } from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier | undefined;
    confirmationResult: import('firebase/auth').ConfirmationResult | undefined;
  }
}

export {};
