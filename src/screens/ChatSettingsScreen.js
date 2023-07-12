import { ScrollView, StyleSheet, Text } from 'react-native';
import { useSelector } from 'react-redux';
import { PageContainer } from '../components/PageContainer';
import { PageTitle } from '../components/PageTitle';
import { ProfileImage } from '../components/ProfileImage';

export const ChatSettingsScreen = ({ route }) => {
  const chatId = route.params.chatId;
  const chatData = useSelector((state) => state.chats.chatsData[chatId]);

  return (
    <PageContainer>
      <PageTitle text='Chat Settings' />

      <ScrollView contentContainerStyle={styles.scrollView}>
        <ProfileImage showEditButton={true} size={80} chatId={chatId} />

        <Text>{chatData.chatName}</Text>
      </ScrollView>
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
});
