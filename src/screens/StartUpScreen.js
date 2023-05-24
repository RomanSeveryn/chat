import { ActivityIndicator, View } from 'react-native';
import colors from '../constants/colors';
import commonStyles from '../constants/commonStyles';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { authenticate, setDidTryAutoLogin } from '../store/authSlice';
import { getUserDate } from '../utils/actions/userActions';

export const StartUpScreen = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const tryLogin = async () => {
      const storedAuthInfo = await AsyncStorage.getItem('userData');
      if (!storedAuthInfo) {
        dispatch(setDidTryAutoLogin());
        return;
      }
      const parsedDate = JSON.parse(storedAuthInfo);
      console.log('parsedDate', parsedDate);
      const { token, userId, expiryDate: expiryDateString } = parsedDate;
      const expiryDate = new Date(expiryDateString);

      if (expiryDate <= new Date() || !token || !userId) {
        dispatch(setDidTryAutoLogin());
        return;
      }

      const userData = await getUserDate(userId);
      console.log('StartUpScreen.userData', userData);
      dispatch(authenticate({ token: token, userData }));
    };
    tryLogin();
  }, [dispatch]);
  return (
    <View style={commonStyles.center}>
      <ActivityIndicator size='large' color={colors.primary} />
    </View>
  );
};
