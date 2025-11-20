import React from 'react';
import { View, useWindowDimensions } from 'react-native';

import { hsvToHex } from '@/utils/colors';
import LinearGradient from './LinearGradient';

interface GradientBgProps {
  hValue?: number;
  sValue?: number;
  vValue?: number;
  color?: string;
}

const GradientBackground: React.FC<GradientBgProps> = ({
  hValue,
  sValue,
  vValue,
  color
}) => {
  const { height: windowHeight } = useWindowDimensions();

  let hexColor;
  if (hValue && sValue && vValue) {
    hexColor = hsvToHex(hValue, sValue, vValue)
  } else if (color) {
    hexColor = color;
  } else {
    return null;
  }
  
  const colorList = [
    { offset: '0%', color: hexColor, opacity: '1' },
    { offset: '50%', color: hexColor, opacity: '0.5' },
    { offset: '75%', color: hexColor, opacity: '0.2' },
    // { offset: '100%', color: 'hsla(0, 0%, 77%, 1.00)', opacity: '1' }
  ];

  return (
    <View style={{
      position: 'absolute',
      bottom: -100,
      width: '100%',
      height: windowHeight + 100,
    }}>
      <LinearGradient angle={90} colorList={colorList} />
    </View >
  );
};

export default GradientBackground;
