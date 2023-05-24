import { getFirebaseApp } from '../firebaseHalper';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, child, set, getDatabase } from 'firebase/database';
import { authenticate } from '../../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const signUp = (firstName, lastName, email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;
      const expiryDate = new Date(expirationTime);
      const userData = await createUser(firstName, lastName, email, uid);
      dispatch(authenticate({ token: accessToken, userData }));
      saveDataToStorage(accessToken, uid, expiryDate);
    } catch (e) {
      const errorCode = e.code;
      console.log('signUp.e', e);

      let message = 'Something went wrong.';
      if (errorCode === 'auth/email-already-in-use') {
        message = 'This email is already in use';
      }
      throw new Error(message);
    }
  };
};

const createUser = async (firstName, lastName, email, userId) => {
  const firstLast = `${firstName} ${lastName}`;
  const userData = {
    firstName,
    lastName,
    firstLast,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };
  const dbRef = ref(getDatabase());
  const childRef = child(dbRef, `users/${userId}`);
  await set(childRef, userData);
  return userData;
};

const saveDataToStorage = (token, userId, expiryDate) => {
  AsyncStorage.setItem(
    'userData',
    JSON.stringify({ token, userId, expiryDate: expiryDate.toISOString() }),
  );
};
