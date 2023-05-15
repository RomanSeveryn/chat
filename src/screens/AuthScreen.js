import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome, Feather } from '@expo/vector-icons';
import { PageContainer } from '../components/PageContainer';
import { Input } from '../components/Input';
import { SubmitButton } from '../components/SubmitButton';

export const AuthScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
        <Input
          label='First Name'
          iconName='user-o'
          IconPack={FontAwesome}
          iconSize={24}
        />
        <Input
          label='Last Name'
          iconName='user-o'
          IconPack={FontAwesome}
          iconSize={24}
        />
        <Input
          label='First Name'
          iconName='mail'
          IconPack={Feather}
          iconSize={24}
        />
        <Input
          label='First Name'
          iconName='lock'
          IconPack={Feather}
          iconSize={24}
        />
        <SubmitButton
          title='Sign up'
          onPress={() => console.log(123)}
          style={{ marginTop: 12 }}
        />
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 32,
    fontFamily: 'black',
  },
});
