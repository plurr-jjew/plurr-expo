import React from 'react';
import { Switch as _Switch, View, Text } from 'react-native';

interface SwitchProps {
  className?: string;
  value: boolean;
  onChange: () => void;
  label: string;
}

const Switch: React.FC<SwitchProps> = ({
  className,
  value,
  onChange,
  label,
}) => {
  const viewClassName = `flex flex-row gap-2${className ? ` ${className}` : ''}`;

  return (
    <View className={viewClassName}>
      <_Switch
        onValueChange={onChange}
        value={value}
      />
      <Text>{label}</Text>
    </View>
  );
};

export default Switch;
