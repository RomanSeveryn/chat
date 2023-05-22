import { useCallback, useEffect, useReducer, useState } from 'react';
import { Alert, ActivityIndicator } from 'react-native';
import { Input } from './Input';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { SubmitButton } from './SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../reducers/formReducer';
import { signUp } from '../utils/actions/authAction';
import colors from '../constants/colors';

const initialState = {
  inputValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  inputValidities: {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  },
  formIsValid: false,
};

export const SignUpForm = () => {
  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState],
  );

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = async () => {
    try {
      // setIsLoading(true);
      await signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password,
      );
      setError(null);
    } catch (e) {
      setError(e.message);
      // setIsLoading(false);
      console.log('authHandler.e', e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Input
        id='firstName'
        label='First Name'
        iconName='user-o'
        IconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['firstName']}
      />
      <Input
        id='lastName'
        label='Last Name'
        iconName='user-o'
        IconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['lastName']}
      />
      <Input
        id='email'
        label='Email'
        iconName='mail'
        IconPack={Feather}
        iconSize={24}
        keyboardType='email-address'
        autoCapitalize='none'
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['email']}
      />
      <Input
        id='password'
        label='Password'
        iconName='lock'
        IconPack={Feather}
        iconSize={24}
        secureTextEntry
        autoCapitalize='none'
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['password']}
      />
      {isLoading ? (
        <ActivityIndicator size='small' color={colors.primary} />
      ) : (
        <SubmitButton
          title='Sign up'
          onPress={authHandler}
          style={{ marginTop: 12 }}
          disabled={!formState?.formIsValid}
        />
      )}
    </>
  );
};
