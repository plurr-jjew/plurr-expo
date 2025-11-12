import React, { Dispatch, SetStateAction } from 'react';
import {
  Text,
  TextInput as _TextInput,
  View,
  TouchableOpacity
} from 'react-native';

interface TextInputProps {
  className?: string;
  label: string;
  placeholder?: string;
  defaultValue: string;
  maxLength?: number;
  onChangeText: Dispatch<SetStateAction<string>>;
  hasButton?: boolean;
  buttonTitle?: string;
  onButtonPress?: () => void;
}

const TextInput: React.FC<TextInputProps> = ({
  className,
  label,
  placeholder = '',
  defaultValue,
  maxLength,
  onChangeText,
  hasButton = false,
  buttonTitle,
  onButtonPress,
}) => {
  return (
    <View className={
      'flex flex-col' +
      (className ? ` ${className}` : '')
    }>
      <Text className="text-xs mb-1">
        {label}
      </Text>
      <View className="flex flex-row px-3 py-2 border rounded-md">
        <_TextInput
          className=""
          placeholder={placeholder}
          maxLength={maxLength}
          onChangeText={onChangeText}
          defaultValue={defaultValue}
        />
        {hasButton ?
          <TouchableOpacity
            className="rounded-md bg-blue-200 px-2 py-2"
            onPress={onButtonPress}
          >
            <Text>{buttonTitle}</Text>
          </TouchableOpacity> :
          null
        }
      </View>
    </View>
  );
};

export default TextInput;
