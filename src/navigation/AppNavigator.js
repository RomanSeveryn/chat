import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './MainNavigator';
import { AuthScreen } from '../screens/AuthScreen';
import { useSelector } from 'react-redux';

export const AppNavigator = () => {
  const isAuth = useSelector(
    (state) => state.auth.token !== null && state.auth.token !== '',
  );
  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && <AuthScreen />}
    </NavigationContainer>
  );
};
