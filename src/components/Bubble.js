import { useRef } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import colors from '../constants/colors';

export const Bubble = ({ text, type }) => {
  const menuRef = useRef(null);
  const id = useRef(uuid.v4());
  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };
  let Container = View;

  switch (type) {
    case 'system':
      textStyle.color = '#65644A';
      bubbleStyle.backgroundColor = colors.beige;
      bubbleStyle.alignItems = 'center';
      bubbleStyle.marginTop = 10;
      break;

    case 'error':
      textStyle.color = 'white';
      bubbleStyle.backgroundColor = colors.red;
      bubbleStyle.marginTop = 10;
      break;
    case 'myMessage':
      wrapperStyle.justifyContent = 'flex-end';
      bubbleStyle.backgroundColor = '#E7FED6';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableWithoutFeedback;
      break;

    case 'theirMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableWithoutFeedback;
      break;

    default:
      break;
  }

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
        style={{ backgroundColor: 'red', width: '100%' }}
      >
        <View style={bubbleStyle}>
          <Text style={textStyle}>{text}</Text>
          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuOption text='1' />
              <MenuOption text='2' />
              <MenuOption text='3' />
              <MenuOption />
              <MenuOption />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: '#E2DACC',
    borderWidth: 1,
  },
  text: {
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
});
