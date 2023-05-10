import { StyleSheet, Text, View } from 'react-native';

export const ChatSettingsScreen = () => {
  return (
    <View style={styles.container}>
      <Text>Hi ChatSettingsScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 32,
    fontFamily: 'black',
  },
});
