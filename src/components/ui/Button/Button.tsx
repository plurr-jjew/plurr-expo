import React, { ReactElement } from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  className?: string;
  title: string;
  LeadingIcon?: ReactElement<any, any>;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  className,
  title,
  LeadingIcon,
  onPress,
}) => (
  <TouchableOpacity
    className={className ? ` ${className}` : ''}
    onPress={onPress}
    style={{
      display: 'flex',
      gap: 5,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      paddingHorizontal: 9,
      paddingVertical: 8,
      backgroundColor: '#acdfffff'
    }}
  >
    {LeadingIcon ? LeadingIcon : null}
    <Text>{title}</Text>
  </TouchableOpacity>
);

export default Button;
