import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import backgroundImage from '../../assets/images/green-nature-background.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import colors from '../constants/colors';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const ChatScreen = ({ navigation, route }) => {
  const [messageText, setMessageText] = useState('');
  const [chatUsers, setChatUsers] = useState([]);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);

  const chatData = route?.params?.newChatData;

  const sendMessage = useCallback(() => {
    setMessageText('');
  }, [messageText]);

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
        ></ImageBackground>
        <View style={styles.inputContainer}>
          <TouchableOpacity
            style={styles.mediaButtons}
            onPress={() => console.log('plus')}
          >
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
