import { StyleSheet } from 'react-native';
import { PageTitle } from '../components/PageTitle';
import { PageContainer } from '../components/PageContainer';
import { Input } from '../components/Input';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useCallback, useReducer } from 'react';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../reducers/formReducer';
import { useSelector } from 'react-redux';

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

export const SettingsScreen = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const userData = useSelector((state) => state.auth.userData);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState],
  );
  return (
    <PageContainer>
      <PageTitle text='Settings' />
      <Input
        id='firstName'
        label='First Name'
        iconName='user-o'
        IconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['firstName']}
        initialValue={userData.firstName}
      />
      <Input
        id='lastName'
        label='Last Name'
        iconName='user-o'
        IconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        errorText={formState.inputValidities['lastName']}
        initialValue={userData.lastName}
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
        initialValue={userData.email}
      />
      <Input
        id='about'
        label='About'
        iconName='user-o'
        IconPack={FontAwesome}
        iconSize={24}
        onInputChanged={inputChangedHandler}
        autoCapitalize='none'
        errorText={formState.inputValidities['about']}
        initialValue={userData.about}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
