import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Image } from 'expo-image';

interface ParensWrapParams {
  children: React.ReactNode;
  height?: number;
}

const ParensWrap: React.FC<ParensWrapParams> = ({ children, height = 30 }) => {
  const parensSize = { height: height, width: height / 3}
  return (
    <View style={styles.parensContainer}>
      <Image
        style={parensSize}
        source={require('@/../assets/images/left-paren.svg')}
        contentFit="contain"
      />
      {children}
      <Image
        style={parensSize}
        source={require('@/../assets/images/right-paren.svg')}
        contentFit="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  parensContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 2,
  }
});

export default ParensWrap;
