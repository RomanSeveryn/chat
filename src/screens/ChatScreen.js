import { useCallback, useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ImageBackground,
  FlatList,
  Image,
  ActivityIndicator,
} from 'react-native';
import backgroundImage from '../../assets/images/green-nature-background.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';
import AwesomeAlert from 'react-native-awesome-alerts';
import { useSelector } from 'react-redux';
import { PageContainer } from '../components/PageContainer';
import { Bubble } from '../components/Bubble';
import {
  createChat,
  sendImage,
  sendTextMessage,
} from '../utils/actions/chatActions';
import { ReplyTo } from '../components/ReplyTo';
import {
  launchImagePicker,
  openCamera,
  uploadImageAsync,
} from '../utils/imagePickerHelper';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { CustomHeaderButton } from '../components/CustomHeaderButton';

export const ChatScreen = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const [chatId, setChatId] = useState(route?.params?.chatId);
  const [errorBannerText, setErrorBannerText] = useState('');
  const [replyingTo, setReplayingTo] = useState('');
  const [tempImageUri, setTempImageUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const flatListRef = useRef();

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
        id,
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

  const title = chatData.chatName ?? getChatTitleFromName();

  useEffect(() => {
    navigation.setOptions({
      headerTitle: title,
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            {chatId && (
              <Item
                title='Chat settings'
                iconName='settings-outline'
                onPress={() => {
                  chatData.isGroupChat
                    ? navigation.navigate('ChatSettings', { chatId })
                    : navigation.navigate('Contact', {
                        uid: chatUsers.find((uid) => uid !== userData.userId),
                      });
                }}
              />
            )}
          </HeaderButtons>
        );
      },
    });
    setChatUsers(chatData.users);
  }, [chatUsers, title]);

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (e) {
      console.log('pickImage.e', e);
    }
  }, [tempImageUri]);

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;

      setTempImageUri(tempUri);
    } catch (error) {
      console.log('takePhoto.error', error);
    }
  }, [tempImageUri]);

  const uploadImage = useCallback(async () => {
    setIsLoading(true);

    try {
      let id = chatId;
      if (!id) {
        id = await createChat(userData.userId, route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      setIsLoading(false);

      await sendImage(
        id,
        userData.userId,
        uploadUrl,
        replyingTo && replyingTo.key,
      );
      setReplayingTo(null);

      setTimeout(() => setTempImageUri(''), 500);
    } catch (error) {
      console.log(error);
    }
  }, [isLoading, tempImageUri, chatId]);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
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
              ref={(ref) => (flatListRef.current = ref)}
              onContentSizeChange={() =>
                flatListRef.current.scrollToEnd({ animated: true })
              }
              onLayout={() =>
                flatListRef.current.scrollToEnd({ animated: true })
              }
              renderItem={(itemData) => {
                const message = itemData.item;

                const isOwnMessage = message.sentBy === userData.userId;

                let messageType;
                if (message.type && message.type === 'info') {
                  messageType = 'info';
                } else if (isOwnMessage) {
                  messageType = 'myMessage';
                } else {
                  messageType = 'theirMessage';
                }

                const sender = message.sentBy && storedUsers[message.sentBy];
                const name = sender && `${sender.firstName} ${sender.lastName}`;

                return (
                  <Bubble
                    text={message.text}
                    type={messageType}
                    messageId={message.key}
                    userId={userData.userId}
                    chatId={chatId}
                    date={message.sentAt}
                    setReply={() => setReplayingTo(message)}
                    name={
                      !chatData.isGroupChat || isOwnMessage ? undefined : name
                    }
                    replyingTo={
                      message.replyTo &&
                      chatMessages.find((i) => i.key === message.replyTo)
                    }
                    imageUrl={message.imageUrl}
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
          <TouchableOpacity style={styles.mediaButtons} onPress={takePhoto}>
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
        <AwesomeAlert
          show={tempImageUri !== ''}
          title='Send Image?'
          closeOnTouchOutside={true}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText='Cancel'
          confirmText='Send image'
          confirmButtonColor={colors.primary}
          cancelButtonColor={colors.red}
          titleStyle={styles.popupTitleStyle}
          onCancelPressed={() => {
            setTempImageUri('');
          }}
          onConfirmPressed={uploadImage}
          onDismiss={() => {
            setTempImageUri('');
          }}
          customView={
            <View>
              {isLoading && (
                <ActivityIndicator size='small' color={colors.primary} />
              )}
              {!isLoading && tempImageUri !== '' && (
                <Image
                  source={{ uri: tempImageUri }}
                  style={{ width: 200, height: 200 }}
                />
              )}
            </View>
          }
        />
      </View>
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
  popupTitleStyle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colors.textColor,
  },
});
