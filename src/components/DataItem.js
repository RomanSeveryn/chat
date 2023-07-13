import { StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { ProfileImage } from './ProfileImage';
import colors from '../constants/colors';

const imageSize = 40;

export const DataItem = ({
  title,
  subTitle,
  image,
  onPress,
  type,
  isChecked,
  icon,
}) => {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={styles.container}>
        {!icon && <ProfileImage uri={image} size={imageSize} />}

        {icon && (
          <View style={styles.leftIconContainer}>
            <AntDesign name={icon} size={20} color={colors.blue} />
          </View>
        )}

        <View style={styles.textContainer}>
          <Text
            numberOfLines={1}
            style={{
              ...styles.title,
              ...{ color: type === 'button' ? colors.blue : colors.textColor },
            }}
          >
            {title}
          </Text>

          {subTitle && (
            <Text numberOfLines={1} style={styles.subTitle}>
              {subTitle}
            </Text>
          )}
        </View>
        {type === 'checkbox' && (
          <View
            style={{
              ...styles.iconContainer,
              ...(isChecked && styles.checkedStyle),
            }}
          >
            <Ionicons name='checkmark' size={18} color='white' />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 7,
    borderBottomColor: colors.extraLightGrey,
    borderBottomWidth: 1,
    alignItems: 'center',
    minHeight: 50,
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  title: {
    fontFamily: 'medium',
    fontSize: 16,
    letterSpacing: 0.3,
  },
  subTitle: {
    fontFamily: 'regular',
    color: colors.grey,
    letterSpacing: 0.3,
  },
  iconContainer: {
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    backgroundColor: 'white',
  },
  checkedStyle: {
    backgroundColor: colors.primary,
    borderColor: 'transparent',
  },
  leftIconContainer: {
    backgroundColor: colors.extraLightGrey,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    width: imageSize,
    height: imageSize,
  },
});
