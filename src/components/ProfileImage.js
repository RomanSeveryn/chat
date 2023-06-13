import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import userImage from '../../assets/images/userImage.jpeg';
import colors from '../constants/colors';
import { launchImagePicker } from '../utils/imagePickerHelper';
import { useState } from 'react';

export const ProfileImage = ({ size, uri }) => {
  const source = uri ? { uri: uri } : userImage;
  const [image, setImage] = useState(source);
  const pickImage = async () => {
    try {
      const tempUri = await launchImagePicker();
      if (!tempUri) return;
      setImage({ uri: tempUri });
    } catch (e) {
      console.log('pickImage.e', e);
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
