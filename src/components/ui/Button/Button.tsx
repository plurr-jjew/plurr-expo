import React, { ReactElement } from 'react';
import { Pressable, Text } from 'react-native';

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
  <Pressable
    className={className ? ` ${className}` : ''}
    onPress={onPress}
    style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 5,
      paddingHorizontal: 9,
      paddingVertical: 5,
      backgroundColor: '#acdfffff'
    }}
  >
    {LeadingIcon ? LeadingIcon : null}
    <Text>{title}</Text>
  </Pressable>
);

export default Button;
