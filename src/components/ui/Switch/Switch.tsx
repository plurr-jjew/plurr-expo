import React from 'react';
import { StyleSheet, Switch as _Switch, View, Text } from 'react-native';

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

  return (
    <View className={className} style={styles.switchContainer}>
      <_Switch
        onValueChange={onChange}
        value={value}
      />
      <Text style={styles.labelText}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10
  },
  labelText: {
    fontFamily: 'AkkuratMono'
  }

})

export default Switch;
