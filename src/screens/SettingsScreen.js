import { ActivityIndicator, StyleSheet } from 'react-native';
import { PageTitle } from '../components/PageTitle';
import { PageContainer } from '../components/PageContainer';
import { Input } from '../components/Input';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { useCallback, useReducer, useState } from 'react';
import { validateInput } from '../utils/actions/formActions';
import { reducer } from '../reducers/formReducer';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../constants/colors';
import { SubmitButton } from '../components/SubmitButton';
import {
  updateSignedInUserData,
  userLogout,
} from '../utils/actions/authAction';

export const SettingsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const userData = useSelector((state) => state.auth.userData);
  const initialState = {
    inputValues: {
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      email: userData.email || '',
      about: userData.password || '',
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState],
  );

  const saveHandler = async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateSignedInUserData(userData.userId, updatedValues);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
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
      {isLoading ? (
        <ActivityIndicator size='small' color={colors.primary} />
      ) : (
        <SubmitButton
          title='Save'
          onPress={saveHandler}
          style={{ marginTop: 12 }}
          disabled={!formState?.formIsValid}
        />
      )}
      <SubmitButton
        title='Logout'
        onPress={() => dispatch(userLogout())}
        style={{ marginTop: 12 }}
        color={colors.red}
      />
    </PageContainer>
  );
};

const styles = StyleSheet.create({});
