import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const ChatListScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text>Hi ChatListScreen</Text>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ChatSettingsScreen');
        }}
      >
        <Text>Click</Text>
      </TouchableOpacity>
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
