import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../components/CustomHeaderButton';

export const ChatListScreen = ({ navigation }) => {
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
  }, [navigation]);
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
