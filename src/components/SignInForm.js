import { useCallback, useEffect, useReducer, useState } from 'react';
import { ActivityIndicator, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { Input } from './Input';
import { SubmitButton } from './SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../reducers/formReducer';
import { signIn } from '../utils/actions/authAction';
import colors from '../constants/colors';

const initialState = {
  inputValues: {
    email: '',
    password: '',
  },
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

export const SignInForm = () => {
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

  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password,
      );
      setError(null);
      await dispatch(action);
    } catch (e) {
      setError(e.message);
      setIsLoading(false);
      console.log('authHandler.e', e);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id='email'
        label='Email'
        iconName='mail'
        IconPack={Feather}
        iconSize={24}
        autoCapitalize='none'
        keyboardType='email-address'
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['email']}
      />
      <Input
        id='password'
        label='Password'
        iconName='lock'
        IconPack={Feather}
        secureTextEntry
        autoCapitalize='none'
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['password']}
      />
      {isLoading ? (
        <ActivityIndicator size='small' color={colors.primary} />
      ) : (
        <SubmitButton
          title='Sign in'
          onPress={authHandler}
          style={{ marginTop: 12 }}
          disabled={!formState?.formIsValid}
        />
      )}
    </>
  );
};
