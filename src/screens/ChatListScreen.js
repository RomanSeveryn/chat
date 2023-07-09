import { FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native';
import React, { useEffect } from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../components/CustomHeaderButton';
import { useSelector } from 'react-redux';
import { DataItem } from '../components/DataItem';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';
import colors from '../constants/colors';

export const ChatListScreen = ({ navigation, route }) => {
  const selectedUser = route?.params?.selectedUserId;
  const selectedUserList = route?.params?.selectedUsers;
  const chatName = route?.params?.chatName;

  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt);
    });
  });

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
    if (!selectedUser && !selectedUserList) {
      return;
    }

    let chatData;
    let navigationProps;

    if (selectedUser) {
      chatData = userChats.find(
        (cd) => !cd.isGroupChat && cd.users.includes(selectedUser),
      );
    }

    if (chatData) {
      navigationProps = { chatId: chatData.key };
    } else {
      const chatUsers = selectedUserList || [selectedUser];
      if (!chatUsers.includes(userData.userId)) {
        chatUsers.push(userData.userId);
      }

      navigationProps = {
        newChatData: {
          users: chatUsers,
          isGroupChat: selectedUserList !== undefined,
          chatName,
        },
      };
    }

    navigation.navigate('ChatScreen', navigationProps);
  }, [route?.params]);
  return (
    <PageContainer>
      <PageTitle text='Chats' />
      <TouchableOpacity
        onPress={() => navigation.navigate('NewChat', { isGroupChat: true })}
      >
        <Text style={styles.newGroupText}>New Group</Text>
      </TouchableOpacity>

      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;
          const isGroupChat = chatData.isGroupChat;

          let title = '';
          const subTitle = chatData.latestMessageText || 'New chat';
          let image = '';

          if (isGroupChat) {
            title = chatData.chatName;
          } else {
            const otherUserId = chatData.users.find(
              (uid) => uid !== userData.userId,
            );
            const otherUser = storedUsers[otherUserId];

            if (!otherUser) return;

            title = `${otherUser.firstName} ${otherUser.lastName}`;
            image = otherUser.profilePicture;
          }

          return (
            <DataItem
              title={title}
              subTitle={subTitle}
              image={image}
              onPress={() => navigation.navigate('ChatScreen', { chatId })}
            />
          );
        }}
      />
    </PageContainer>
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
  newGroupText: {
    color: colors.blue,
    fontSize: 17,
    marginBottom: 5,
  },
});
