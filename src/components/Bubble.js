import { useRef } from 'react';
import { Text, View, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import uuid from 'react-native-uuid';
import * as Clipboard from 'expo-clipboard';
import colors from '../constants/colors';
import { Feather, FontAwesome } from '@expo/vector-icons';
import { starMessage } from '../utils/actions/chatActions';
import { useSelector } from 'react-redux';

function formatAmPm(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  return hours + ':' + minutes + ' ' + ampm;
}

const MenuItem = ({ text, onSelect, iconPack, icon }) => {
  const Icon = iconPack ?? Feather;
  return (
    <MenuOption onSelect={onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{text}</Text>
        <Icon name={icon} size={18} />
      </View>
    </MenuOption>
  );
};

export const Bubble = ({
  text,
  type,
  messageId,
  userId,
  chatId,
  date,
  setReply,
  replyingTo,
  name,
}) => {
  const starredMessages = useSelector(
    (state) => state.messages.starredMessages[chatId] || {},
  );
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());
  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };
  let Container = View;
  let isUserMessage = false;
  const dateString = date && formatAmPm(date);

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
      isUserMessage = true;
      break;

    case 'theirMessage':
      wrapperStyle.justifyContent = 'flex-start';
      bubbleStyle.maxWidth = '90%';
      Container = TouchableWithoutFeedback;
      isUserMessage = true;
      break;

    case 'reply':
      bubbleStyle.backgroundColor = '#f2f2f2';

    default:
      break;
  }

  const copyToClipboard = async (text) => {
    try {
      await Clipboard.setStringAsync(text);
    } catch (e) {
      console.log('copyToClipboard.e', e);
    }
  };

  const isStarred = isUserMessage && starredMessages[messageId] !== undefined;
  const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
        style={{ width: '100%' }}
      >
        <View style={bubbleStyle}>
          {name && <Text style={styles.name}>{name}</Text>}
          {replyingToUser && (
            <Bubble
              type='reply'
              text={replyingTo.text}
              name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
            />
          )}

          <Text style={textStyle}>{text}</Text>

          {dateString && (
            <View style={styles.timeContainer}>
              {isStarred && (
                <FontAwesome
                  name='star'
                  size={14}
                  color={colors.textColor}
                  style={{ marginRight: 5 }}
                />
              )}
              <Text style={styles.time}>{dateString}</Text>
            </View>
          )}

          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem
                icon='copy'
                text='Copy to clipboard'
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                icon={`${isStarred ? 'star-o' : 'star'}`}
                iconPack={FontAwesome}
                text={`${isStarred ? 'Unstar' : 'Star'} message`}
                onSelect={() => starMessage(messageId, chatId, userId)}
              />
              <MenuItem
                icon='arrow-left-circle'
                text='Reply'
                onSelect={setReply}
              />
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
  menuItemContainer: {
    flexDirection: 'row',
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'regular',
    letterSpacing: 0.3,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  time: {
    fontFamily: 'regular',
    fontSize: 12,
    color: colors.grey,
    letterSpacing: 0.3,
  },
  name: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
  },
});
