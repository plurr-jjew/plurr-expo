import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  Easing,
} from 'react-native-reanimated';

interface FloatingProps {
  children: React.ReactNode;
}

const FloatingComponent: React.FC<FloatingProps> = ({ children }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);

  React.useEffect(() => {
    translateX.value = withRepeat(
      withTiming(3, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1, // -1 for infinite repeat
      true // Reverse the animation on each repeat
    );
    translateY.value = withRepeat(
      withTiming(-10, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: translateX.value },
        { translateY: translateY.value }
      ],
    };
  });

  return (
    <Animated.View style={animatedStyle}>
      {children}
    </Animated.View>
  );
};

export default FloatingComponent;
