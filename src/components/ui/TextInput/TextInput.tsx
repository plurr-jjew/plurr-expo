import React, { useState, Dispatch, SetStateAction } from 'react';
import {
  StyleSheet,
  Text,
  TextInput as _TextInput,
  View,
  TouchableOpacity,
  KeyboardTypeOptions
} from 'react-native';

interface TextInputProps {
  className?: string;
  fullWidth?: boolean;
  label?: string;
  placeholder?: string;
  value: string;
  maxLength?: number;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (Dispatch<SetStateAction<string>>) | ((text: string) => void);
  hasButton?: boolean;
  buttonTitle?: string;
  buttonDisabled?: boolean;
  onButtonPress?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  className,
  fullWidth = false,
  label,
  placeholder = '',
  value,
  maxLength,
  keyboardType = 'default',
  onChangeText,
  hasButton = false,
  buttonTitle,
  buttonDisabled,
  onButtonPress,
}) => {
  const [isChildFocused, setIsChildFocused] = useState(false);

  const handleFocus = () => {
    setIsChildFocused(true);
  };

  const handleBlur = () => {
    setIsChildFocused(false);
  };

  return (
    <View
      className={className ? ` ${className}` : ''}
      style={[styles.view, fullWidth && styles.fullWidth]}
    >
      {label ?
        <Text style={styles.labelText}>{label}</Text> : null
      }
      <View style={[
        styles.textInputView,
        isChildFocused && styles.textInputViewFocused,
        hasButton && styles.textInputViewHasButton,
      ]}>
        <_TextInput
          style={styles.textInput}
          placeholder={placeholder}
          maxLength={maxLength}
          keyboardType={keyboardType}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          value={value}
        />
        {hasButton ?
          <View style={styles.buttonView}>
            <TouchableOpacity
              style={styles.button}
              disabled={buttonDisabled}
              onPress={onButtonPress}
            >
              <Text style={styles.buttonText}>
                {buttonTitle}
              </Text>
            </TouchableOpacity>
          </View> : null
        }
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  view: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: 500,
  },
  fullWidth: {
    width: '100%',
  },
  labelText: {
    fontFamily: 'AkkuratMono',
    marginBottom: 2,
    marginLeft: 15,
  },
  textInputView: {
    display: 'flex',
    flexDirection: 'row',
    minWidth: 250,
    width: '100%',
    height: 56,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 6,
    fontSize: 18,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 20,
  },
  textInputViewFocused: {
    borderColor: '#007AFF',
  },
  textInputViewHasButton: {
    paddingRight: 6,
  },
  textInput: {
    height: '100%',
    fontFamily: 'AkkuratMono',
    outlineStyle: 'none' as any,
    fontSize: 18,
  },
  buttonView: {
    display: 'flex',
    alignItems: 'flex-end',
    flex: 1,
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    height: '100%',
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  buttonText: {
    color: '#FFF',
    fontFamily: 'AkkuratMono',
    fontWeight: 600,
    fontSize: 16
  },
});

export default TextInput;
