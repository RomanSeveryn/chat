import { ChatSettingsScreen } from '../screens/ChatSettingsScreen';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ChatListScreen } from '../screens/ChatListScreen';
import { Ionicons } from '@expo/vector-icons';
import { SettingsScreen } from '../screens/SettingsScreen';
import { ChatScreen } from '../screens/ChatScreen';

export const MainNavigator = () => {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();

  function TabNavigator() {
    return (
      <Tab.Navigator screenOptions={{ headerTitle: '' }}>
        <Tab.Screen
          name='ChatListScreen'
          component={ChatListScreen}
          options={{
            tabBarLabel: 'Chats',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='chatbubble-outline' size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name='Settings'
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name='settings-outline' size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }
  return (
    <Stack.Navigator initialRouteName='ChatListScreen'>
      <Stack.Screen
        name='Home'
        component={TabNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name='ChatScreen'
        component={ChatScreen}
        options={{
          headerTitle: '',
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name='ChatSettingsScreen'
        component={ChatSettingsScreen}
        options={{
          headerTitle: 'Settings',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};
