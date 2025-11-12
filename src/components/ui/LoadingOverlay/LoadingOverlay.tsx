import React from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

interface LoadingProps {
  show?: boolean;
  text?: string | null;
}

const LoadingOverlay: React.FC<LoadingProps> = ({
  show = false,
  text,
}) => {
  if (!show) return null;
  return (
    <Animated.View
      style={styles.loadingContainer}
      exiting={FadeOut.duration(200)}
      entering={FadeIn.duration(200)}
    >
      <ActivityIndicator color="#FFF" size="large" />
      {text ?  <Text className="mt-5 text-white">{text}</Text> : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    zIndex: 5000,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000ab',
  }
});

export default LoadingOverlay;
