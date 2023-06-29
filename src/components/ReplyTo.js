import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import colors from '../constants/colors';

export const ReplyTo = ({ text, user, onCancel }) => {
  const name = `${user.firstName} ${user.lastName}`;
  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
        <AntDesign name='closecircleo' size={24} color={colors.blue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.extraLightGrey,
    padding: 8,
    borderLeftColor: colors.blue,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    color: colors.blue,
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
});
