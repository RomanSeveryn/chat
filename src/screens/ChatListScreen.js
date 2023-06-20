import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../components/CustomHeaderButton';
import { useSelector } from 'react-redux';

export const ChatListScreen = ({ navigation, route }) => {
  const selectedUser = route?.params?.selectedUserId;

  const userData = useSelector((state) => state.auth.userData);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title='New chat'
              iconName='create-outline'
              onPress={() => navigation.navigate('NewChat')}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) return;

    const chatUsers = [selectedUser, userData.userId];
    const navigationProps = { newChatData: { users: chatUsers } };

    navigation.navigate('ChatScreen', navigationProps);
  }, [route?.params]);
  return (
    <View style={styles.container}>
      <Text>Hi ChatListScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChatScreen');
        }}
      >
        <Text>Go to Chat screen</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 32,
    fontFamily: 'black',
  },
});
