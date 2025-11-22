import React from 'react';
import {
  Text,
  ActivityIndicator,
  StyleSheet,
  useWindowDimensions
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
  const { height: windowHeight } = useWindowDimensions();

  if (!show) return null;
  return (
    <Animated.View
      style={[styles.loadingContainer, { height: windowHeight + 100 }]}
      exiting={FadeOut.duration(200)}
      entering={FadeIn.duration(200)}
    >
      <ActivityIndicator color="#FFF" size="large" />
      {text ? <Text className="mt-5 text-white">{text}</Text> : null}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    zIndex: 10000,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000ab',
  }
});

export default LoadingOverlay;
