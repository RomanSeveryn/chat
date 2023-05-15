import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import colors from '../constants/colors';

export const SubmitButton = ({ color, disabled, title, onPress, style }) => {
  const enableBgColor = color || colors.primary;
  const disableBgColor = colors.lightGrey;
  const bgColor = disabled ? disableBgColor : enableBgColor;
  return (
    <TouchableOpacity
      onPress={disabled ? () => {} : onPress}
      style={{ ...styles.button, ...style, backgroundColor: bgColor }}
    >
      <Text style={{ color: disabled ? colors.grey : 'white' }}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 30,
  },
});
