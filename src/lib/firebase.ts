import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyA4dRHZbD7Aylm8vFNV1hHkYAfywkzFw",
  authDomain: "ogura-9f141.firebaseapp.com",
  projectId: "ogura-9f141",
  storageBucket: "ogura-9f141.appspot.com",
  messagingSenderId: "38890380304",
  appId: "1:38890380304:web:567e72624a832a63cac6b59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
