import { StyleSheet, View, Text, TextInput } from 'react-native';
import colors from '../constants/colors';

export const Input = ({
  id,
  label,
  iconName,
  iconSize,
  errorText,
  IconPack,
  onInputChanged,
  style,
  ...rest
}) => {
  const onChangeText = (text) => {
    onInputChanged(id, text);
  };

  return (
    <View style={{ ...styles.container, ...style }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        {iconName && (
          <IconPack name={iconName} size={iconSize} style={styles.icon} />
        )}
        <TextInput style={styles.input} onChangeText={onChangeText} {...rest} />
      </View>
      {errorText && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorText[0]}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 2,
    backgroundColor: colors.nearlyWhite,
    alignItems: 'center',
  },
  icon: {
    marginRight: 15,
    color: colors.grey,
  },
  label: {
    marginVertical: 8,
    fontFamily: 'bold',
    letterSpacing: 0.3,
    color: colors.textColor,
  },
  input: {
    flex: 1,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  errorContainer: {
    marginVertical: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 13,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
