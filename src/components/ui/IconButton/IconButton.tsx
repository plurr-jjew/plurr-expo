import React, { ReactElement } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';

interface IconButtonProps {
  className?: string;
  Icon: ReactElement<any, any>;
  onPress: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({
  className: _className,
  Icon,
  onPress
}) => {
  const className = `p-1${_className ? ` ${_className}` : ''}`
  return (
    <TouchableOpacity
      className={className}
      onPress={onPress}
    >
      {Icon ? Icon : null}
    </TouchableOpacity>
  );
};

export default IconButton;