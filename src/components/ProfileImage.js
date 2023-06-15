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

export const ProfileImage = ({ size, uri, userId }) => {
  const dispatch = useDispatch();
  const source = uri ? { uri: uri } : userImage;
  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;
      setIsLoading(true);
      const uploadUrl = await uploadImageAsync(tempUri);
      setIsLoading(false);

      if (!uploadUrl) {
        throw new Error('Could not upload image');
      }

      const newData = { profilePicture: uploadUrl };
      console.log('pickImage.newData', newData);

      await updateSignedInUserData(userId, newData);
      dispatch(updateLoggedInUserData({ newData }));

      setImage({ uri: uploadUrl });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };
  return (
    <TouchableOpacity onPress={pickImage}>
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

      <View style={styles.editIconContainer}>
        <FontAwesome name='pencil' size={16} color='black' />
      </View>
    </TouchableOpacity>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
