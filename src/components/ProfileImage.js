import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
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
  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();

      if (!tempUri) return;

      const uploadUrl = await uploadImageAsync(tempUri);

      if (!uploadUrl) {
        throw new Error('Could not upload image');
      }

      const newData = { profilePicture: uploadUrl };

      await updateSignedInUserData(userId, newData);
      dispatch(updateLoggedInUserData({ newData }));

      setImage({ uri: uploadUrl });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TouchableOpacity onPress={pickImage}>
      <Image
        style={{ ...styles.image, ...{ height: size, width: size } }}
        source={image}
      />
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
});
