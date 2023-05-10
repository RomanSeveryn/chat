import { NavigationContainer } from '@react-navigation/native';
import { MainNavigator } from './MainNavigator';

export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <MainNavigator />
    </NavigationContainer>
  );
};
