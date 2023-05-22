import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  TouchableOpacity,
  Text,
  Image,
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { PageContainer } from '../components/PageContainer';
import { SignUpForm } from '../components/SignUpForm';
import { SignInForm } from '../components/SignInForm';
import colors from '../constants/colors';
import logo from '../../assets/images/logo.png';

export const AuthScreen = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <PageContainer>
        <ScrollView>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'height' : undefined}
            keyboardVerticalOffset={100}
            style={styles.keyboardAvoidingView}
          >
            <View style={styles.imageContainer}>
              <Image source={logo} resizeMode='contain' style={styles.image} />
            </View>
            {isSignUp ? <SignUpForm /> : <SignInForm />}
            <TouchableOpacity
              style={styles.linkContainer}
              onPress={() => setIsSignUp((prev) => !prev)}
            >
              <Text style={styles.link}>{`Switch to ${
                isSignUp ? 'sign in' : 'sign up'
              }`}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 15,
  },
  link: {
    color: colors.blue,
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '50%',
  },
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'center',
  },
});
