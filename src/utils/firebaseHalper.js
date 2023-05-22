import { initializeApp } from 'firebase/app';

export const getFirebaseApp = () => {
  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyDvv5V3z7KVGAPKOsd-qJFd1MzOMxWjhhI',
    authDomain: 'whatsapp-791c9.firebaseapp.com',
    projectId: 'whatsapp-791c9',
    storageBucket: 'whatsapp-791c9.appspot.com',
    messagingSenderId: '699107151833',
    appId: '1:699107151833:web:0d76232bc358a3c55d13c8',
  };

  // Initialize Firebase
  return initializeApp(firebaseConfig);
};
