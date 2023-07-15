import { useCallback, useEffect, useReducer, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';
import { ProfileImage } from '../components/ProfileImage';
import { Input } from '../components/Input';
import { reducer } from '../reducers/formReducer';
import { validateInput } from '../utils/actions/formActions';
import {
  addUsersToChat,
  removeUserFromChat,
  updateChatData,
} from '../utils/actions/chatActions';
import { SubmitButton } from '../components/SubmitButton';
import colors from '../constants/colors';
import { DataItem } from '../components/DataItem';

export const ChatSettingsScreen = ({ navigation, route }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const chatId = route.params.chatId;
  const chatData = useSelector((state) => state.chats.chatsData[chatId] || {});
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const initialState = {
    inputValues: { chatName: chatData.chatName },
    inputValidities: { chatName: undefined },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const selectedUsers = route.params && route.params.selectedUsers;
  useEffect(() => {
    if (!selectedUsers) {
      return;
    }

    const selectedUserData = [];
    selectedUsers.forEach((uid) => {
      if (uid === userData.userId) return;

      if (!storedUsers[uid]) {
        console.log('No user data found in the data store');
        return;
      }

      selectedUserData.push(storedUsers[uid]);
    });

    addUsersToChat(userData, selectedUserData, chatData);
  }, [selectedUsers]);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState],
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateChatData(chatId, userData.userId, updatedValues);

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [formState]);

  const hasChanges = () => {
    const currentValues = formState.inputValues;
    return currentValues.chatName != chatData.chatName;
  };

  const leaveChat = useCallback(async () => {
    try {
      setIsLoading(true);

      await removeUserFromChat(userData, userData, chatData);

      navigation.popToTop();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [navigation, isLoading]);

  if (!chatData.users) return null;

  return (
    <PageContainer>
      <PageTitle text='Chat Settings' />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage
          showEditButton={true}
          size={80}
          chatId={chatId}
          userId={userData.userId}
          uri={chatData.chatImage}
        />

        <Input
          id='chatName'
          label='Chat name'
          autoCapitalize='none'
          initialValue={chatData.chatName}
          allowEmpty={false}
          onInputChanged={inputChangedHandler}
          errorText={formState.inputValidities['chatName']}
        />

        <View style={styles.sectionContainer}>
          <Text style={styles.heading}>
            {chatData.users.length} Participants
          </Text>

          <DataItem
            title='Add users'
            icon='plus'
            type='button'
            onPress={() =>
              navigation.navigate('NewChat', {
                isGroupChat: true,
                existingUsers: chatData.users,
                chatId,
              })
            }
          />
          {chatData.users.slice(0, 4).map((uid) => {
            const currentUser = storedUsers[uid];
            return (
              <DataItem
                key={uid}
                image={currentUser.profilePicture}
                title={`${currentUser.firstName} ${currentUser.lastName}`}
                subTitle={currentUser.about}
                type={uid !== userData.userId && 'link'}
                onPress={() =>
                  uid !== userData.userId &&
                  navigation.navigate('Contact', { uid, chatId })
                }
              />
            );
          })}

          {chatData.users.length > 4 && (
            <DataItem
              type={'link'}
              title='View all'
              hideImage={true}
              onPress={() =>
                navigation.navigate('DataList', {
                  title: 'Participants',
                  data: chatData.users,
                  type: 'users',
                  chatId,
                })
              }
            />
          )}
        </View>

        {showSuccessMessage && <Text>Saved!!!</Text>}

        {isLoading ? (
          <ActivityIndicator size={'small'} color={colors.primary} />
        ) : (
          hasChanges() && (
            <SubmitButton
              title='Save changes'
              color={colors.primary}
              onPress={saveHandler}
              disabled={!formState.formIsValid}
            />
          )
        )}
      </ScrollView>
      {
        <SubmitButton
          title='Leave chat'
          color={colors.red}
          onPress={() => leaveChat()}
          style={{ marginBottom: 20 }}
        />
      }
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionContainer: {
    width: '100%',
    marginTop: 10,
  },
  heading: {
    marginVertical: 8,
    color: colors.textColor,
    fontFamily: 'bold',
    letterSpacing: 0.3,
  },
});
