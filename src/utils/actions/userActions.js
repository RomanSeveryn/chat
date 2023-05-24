import { child, getDatabase, ref, get } from 'firebase/database';
import { getFirebaseApp } from '../firebaseHalper';

export const getUserDate = async (userId) => {
  try {
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userRef = child(dbRef, `users/${userId}`);
    const snapshots = await get(userRef);
    return snapshots.val();
  } catch (e) {
    console.log('getUserDate.e', e);
  }
};
