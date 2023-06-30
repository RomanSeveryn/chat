import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  FlatList,
} from 'react-native';
import backgroundImage from '../../assets/images/green-nature-background.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { PageContainer } from '../components/PageContainer';
import { Bubble } from '../components/Bubble';
import { createChat, sendTextMessage } from '../utils/actions/chatActions';
import { ReplyTo } from '../components/ReplyTo';
import { launchImagePicker } from '../utils/imagePickerHelper';

export const ChatScreen = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState('');
  const [replyingTo, setReplayingTo] = useState('');
  const [tempImageUri, setTempImageUri] = useState('');

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const chatMessages = useSelector((state) => {
    if (!chatId) return [];
    const chatMessagesData = state.messages.messagesData[chatId];
    if (!chatMessagesData) return [];
    const messageList = [];
    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({ key, ...message });
    }
    return messageList;
  });

  const chatData =
    (chatId && storedChats[chatId]) || route?.params?.newChatData;

  const sendMessage = useCallback(async () => {
    try {
      let id = chatId;
      if (!id) {
        id = await createChat(userData.userId, route.params.newChatData);
        setChatId(id);
      }

      await sendTextMessage(
        chatId,
        userData.userId,
        messageText,
        replyingTo && replyingTo.key,
      );
      setMessageText('');
      setReplayingTo(null);
    } catch (error) {
      console.log('sendMessage.error', error);
      setErrorBannerText('Message failed to send');
      setTimeout(() => setErrorBannerText(''), 5000);
    }
  }, [messageText, chatId]);

  const getChatTitleFromName = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];

    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    navigation.setOptions({
      headerTitle: getChatTitleFromName(),
    });
    setChatUsers(chatData.users);
  }, [chatUsers]);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (e) {
      console.log('pickImage.e', e);
    }
  }, [tempImageUri]);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={100}
      >
        <ImageBackground
          source={backgroundImage}
          style={styles.backgroundImage}
        >
          <PageContainer style={{ backgroundColor: 'transparent' }}>
            {!chatId && (
              <Bubble text='This is a new chat. Say hi!' type='system' />
            )}
            {errorBannerText !== '' && (
              <Bubble text={errorBannerText} type='error' />
            )}
            {chatId && (
              <FlatList
                data={chatMessages}
                renderItem={(itemData) => {
                  const message = itemData.item;
                  const isOwnMessage = message.sentBy === userData.userId;
                  const messageType = isOwnMessage
                    ? 'myMessage'
                    : 'theirMessage';
                  return (
                    <Bubble
                      text={message.text}
                      type={messageType}
                      messageId={message.key}
                      userId={userData.userId}
                      chatId={chatId}
                      date={message.sentAt}
                      setReply={() => setReplayingTo(message)}
                      replyingTo={
                        message.replyTo &&
                        chatMessages.find((i) => i.key === message.replyTo)
                      }
                    />
                  );
                }}
              />
            )}
          </PageContainer>
          {replyingTo && (
            <ReplyTo
              text={replyingTo.text}
              user={storedUsers[replyingTo.sentBy]}
              onCancel={() => setReplayingTo(null)}
            />
          )}
        </ImageBackground>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButtons} onPress={pickImage}>
            <Feather name='plus' size={24} color={colors.blue} />
          </TouchableOpacity>
          <TextInput
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            style={styles.textBox}
            onSubmitEditing={sendMessage}
          />
          {messageText === '' && (
            <TouchableOpacity
              style={styles.mediaButtons}
              onPress={() => console.log('camera')}
            >
              <Feather name='camera' size={24} color={colors.blue} />
            </TouchableOpacity>
          )}
          {messageText !== '' && (
            <TouchableOpacity
              style={{ ...styles.mediaButtons, ...styles.sendButton }}
              onPress={sendMessage}
            >
              <Feather name='send' size={20} color='white' />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  screen: { flex: 1 },
  inputContainer: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 8,
    height: 50,
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 15,
    paddingHorizontal: 12,
  },
  backgroundImage: {
    flex: 1,
  },
  mediaButtons: {
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 8,
  },
});
