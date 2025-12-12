import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAd4RHZDbA7y1wnfgFNV1hHWkYAfywkxFw",
  authDomain: "ogura-9f141.firebaseapp.com",
  projectId: "ogura-9f141",
  storageBucket: "ogura-9f141.firebasestorage.app",
  messagingSenderId: "388983003804",
  appId: "1:388983003804:web:567e72624a832a63ca6b59"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
