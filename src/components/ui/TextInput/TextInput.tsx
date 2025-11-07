import React, { Dispatch, SetStateAction } from 'react';
import {
  Pressable,
  Text,
  TextInput as _TextInput,
  View
} from 'react-native';

interface TextInputProps {
  className?: string;
  label: string;
  placeholder?: string;
  defaultValue: string;
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
          onChangeText={onChangeText}
          defaultValue={defaultValue}
        />
        {hasButton ?
          <Pressable
            className="rounded-sm bg-blue-200 px-2 py-1"
            onPress={onButtonPress}
          >
            <Text>{buttonTitle}</Text>
          </Pressable> :
          null
        }
      </View>
    </View>
  );
};

export default TextInput;
