import { useCallback, useReducer } from 'react';
import { Input } from './Input';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { SubmitButton } from './SubmitButton';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../reducers/formReducer';

const initialState = {
  inputValidities: {
    email: false,
    password: false,
  },
  formIsValid: false,
};

export const SignUpForm = () => {
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
      <SubmitButton
        title='Sign up'
        onPress={() => console.log(123)}
        style={{ marginTop: 12 }}
        disabled={!formState?.formIsValid}
      />
    </>
  );
};
