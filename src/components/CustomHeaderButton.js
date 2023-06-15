import { HeaderButton } from 'react-navigation-header-buttons';
import { Ionicons } from '@expo/vector-icons';
import colors from '../constants/colors';

export const CustomHeaderButton = (rest) => {
  return (
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={23}
      color={colors.blue}
      {...rest}
    />
  );
};
