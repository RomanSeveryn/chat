import { Input } from './Input';
import { Feather } from '@expo/vector-icons';
import { SubmitButton } from './SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../reducers/formReducer';
import { useCallback, useReducer } from 'react';

const initialState = {
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

export const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result });
    },
    [dispatchFormState],
  );

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
      <SubmitButton
        title='Sign in'
        onPress={() => console.log(123)}
        style={{ marginTop: 12 }}
        disabled={!formState?.formIsValid}
      />
    </>
  );
};
