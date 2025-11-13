import React, { ReactElement } from 'react';
import { StyleSheet, TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';

type variants = 'text' | 'contained' | 'outlined';
type styleType = keyof typeof styles;

const primaryColor = '#007AFF';

interface ButtonProps {
  className?: string;
  variant?: variants;
  title: string;
  LeadingIcon?: ReactElement<any, any>;
  disabled?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  className,
  variant = 'contained',
  title,
  LeadingIcon,
  disabled = false,
  fullWidth = false,
  onPress,
}) => {
  const capVariant = variant.charAt(0).toUpperCase() + variant.slice(1);
  const buttonStyleKey = 'button' + capVariant as styleType;
  const disabledStyleKey = 'disabled' + capVariant as styleType;
  const textStyleKey = 'text' + capVariant as styleType;

  const buttonStyles = [
    styles[buttonStyleKey],
    disabled && styles[disabledStyleKey],
  ] as ViewStyle[];
  const textStyles = styles[textStyleKey] as TextStyle;

  return (
    <TouchableOpacity
      className={className ? ` ${className}` : ''}
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        fullWidth && styles.fullWidth,
        ...buttonStyles,
      ]}
    >
      {LeadingIcon ? LeadingIcon : null}
      <Text style={[
        styles.text,
        textStyles,
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    display: 'flex',
    gap: 8,
    maxWidth: 500,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 25,
    paddingVertical: 15,
  },
  buttonContained: {
    backgroundColor: primaryColor,
  },
  buttonOutlined: {
    borderColor: primaryColor,
    borderWidth: 2,
  },
  buttonText: {
    backgroundColor: 'none',
  },
  fullWidth: {
    width: '100%',
  },
  disabledContained: {
    backgroundColor: '#ccc',
  },
  disabledOutlined: {
    opacity: 0.4,
  },
  disabledText: {
    opacity: 0.4,
  },
  text: {
    fontFamily: 'AkkuratMono',
    fontSize: 18,
    fontWeight: '600',
  },
  textContained: {
    color: '#FFF',
  },
  textOutlined: {
    color: primaryColor,
  },
  textText: {
    fontSize: 16,
    fontWeight: '400',
    color: primaryColor,
  }
});

export default Button;
