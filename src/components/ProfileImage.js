import {
  ActivityIndicator,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import userImage from '../../assets/images/userImage.jpeg';
import colors from '../constants/colors';
import {
  launchImagePicker,
  uploadImageAsync,
} from '../utils/imagePickerHelper';
import { useState } from 'react';
import { updateSignedInUserData } from '../utils/actions/authAction';
import { useDispatch } from 'react-redux';
import { updateLoggedInUserData } from '../store/authSlice';
import { updateChatData } from '../utils/actions/chatActions';

export const ProfileImage = ({
  size,
  uri,
  userId,
  showEditButton,
  showRemoveButton,
  onPress,
  style,
  chatId,
}) => {
  const dispatch = useDispatch();
  const source = uri ? { uri: uri } : userImage;
  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const isShowEditButton = showEditButton && showEditButton === true;
  const isShowRemoveButton = showRemoveButton && showRemoveButton === true;

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      setIsLoading(true);
      const uploadUrl = await uploadImageAsync(tempUri, chatId !== undefined);
      setIsLoading(false);

      if (!uploadUrl) {
        throw new Error('Could not upload image');
      }

      if (chatId) {
        await updateChatData(chatId, userId, { chatImage: uploadUrl });
      } else {
        const newData = { profilePicture: uploadUrl };

        await updateSignedInUserData(userId, newData);
        dispatch(updateLoggedInUserData({ newData }));
      }

      setImage({ uri: uploadUrl });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const Container = onPress || isShowEditButton ? TouchableOpacity : View;
  return (
    <Container style={style} onPress={onPress || pickImage}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size='small' color={colors.primary} />
        </View>
      ) : (
        <Image
          style={{ ...styles.image, ...{ height: size, width: size } }}
          source={image}
        />
      )}

      {!isLoading && isShowEditButton && (
        <View style={styles.editIconContainer}>
          <FontAwesome name='pencil' size={16} color='black' />
        </View>
      )}

      {!isLoading && isShowRemoveButton && (
        <View style={styles.removeIconContainer}>
          <FontAwesome name='close' size={16} color='black' />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: 'absolute',
    right: 0,
    bottom: -5,
  },
  removeIconContainer: {
    position: 'absolute',
    right: -3,
    bottom: -3,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
