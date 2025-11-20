import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, PanResponder, GestureResponderEvent, PanResponderGestureState } from 'react-native';

interface VerticalSliderProps {
  height?: number;
  width?: number;
  min?: number;
  max?: number;
  initialValue?: number;
  step?: number;
  label?: string;
  showTicks?: boolean;
  onValueChange?: (value: number) => void;
}

const VerticalSlider: React.FC<VerticalSliderProps> = ({
  height = 200,
  width = 60,
  min = -12,
  max = 12,
  initialValue = 0,
  step = 0.1,
  label = '',
  showTicks = false,
  onValueChange
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const trackHeight = height - 40;
  const startYRef = useRef<number>(0);
  const startValueRef = useRef<number>(value);
  // console.log(startValueRef)
  if (label === 'V')
    console.log(label, value)
  const panResponder = useRef(
    useMemo(() => PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        startYRef.current = evt.nativeEvent.pageY;
        console.log('panresponder grant value: ', value)
        startValueRef.current = value;
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const deltaY = gestureState.dy;

        // Calculate value change based on drag distance
        const valueRange = max - min;
        const pixelToValue = valueRange / trackHeight;
        const valueChange = -deltaY * pixelToValue; // Negative because Y increases downward

        let newValue = startValueRef.current + valueChange;
        // let newValue = value + valueChange;
        // console.log('new value: ', value, startValueRef.current, valueChange, newValue)

        // Apply step
        newValue = Math.round(newValue / step) * step;

        // Clamp to min/max
        newValue = Math.max(min, Math.min(max, newValue));

        setValue(newValue);
        // console.log(label, newValue)
        if (onValueChange) {
          onValueChange(newValue);
        }
      },
      onPanResponderRelease: () => {
        console.log('on release', value)
        startValueRef.current = value;
      },
      onPanResponderTerminate: () => {
        console.log('on terminate');
        startValueRef.current = value;
      },
    }), [])
  ).current;

  // Calculate thumb position
  const percentage = (value - min) / (max - min);
  const thumbPosition = (1 - percentage) * trackHeight;

  // Determine color based on value
  const getTrackColor = () => {
    if (value > 0) return '#888888ff';
    if (value < 0) return '#f87171';
    return '#2d2d2d';
  };

  // Calculate fill height
  const zeroPosition = ((0 - min) / (max - min)) * trackHeight;
  const fillHeight = Math.abs(thumbPosition - zeroPosition);
  const fillTop = Math.min(thumbPosition, zeroPosition);

  const tickValues = [max, max / 2, 0, min / 2, min];

  return (
    <View style={styles.container}>
      {/* <View style={styles.labelContainer}>
        <Text style={styles.label}>{label}</Text>
      </View> */}

      <View
        style={[
          styles.sliderContainer,
          { height, width }
        ]}
      >
        {/* Track background */}
        <View style={[styles.track, { height: trackHeight }]}>
          {/* Tick marks */}
          {showTicks ? tickValues.map((tickValue, i) => {
            const tickPos = ((max - tickValue) / (max - min)) * trackHeight;
            return (
              <View key={i} style={[styles.tickContainer, { top: tickPos }]}>
                <View style={styles.tick} />
                <Text style={styles.tickLabel}>
                  {tickValue > 0 ? '+' : ''}{tickValue.toFixed(0)}
                </Text>
              </View>
            );
          }) : null}

          {/* Zero line */}
          <View style={[styles.zeroLine, { top: zeroPosition }]} />

          {/* Fill */}
          <View style={[
            styles.fill,
            {
              top: fillTop,
              height: fillHeight,
              backgroundColor: getTrackColor(),
            }
          ]} />
        </View>

        {/* Thumb */}
        <View
          {...panResponder.panHandlers}
          style={[
            styles.thumb,
            { top: thumbPosition + 20 }
          ]}
        >
          <View style={styles.thumbInner} />
        </View>
      </View>

      {/* Value display */}
      {/* <View style={styles.valueContainer}>
        <Text style={[styles.valueText, { color: getTrackColor() }]}>
          {value > 0 ? '+' : ''}{value.toFixed(1)} dB
        </Text>
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 15,
    // backgroundColor: '#1a1a1a',
    // borderRadius: 8,
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.5,
    // shadowRadius: 8,
    elevation: 8,
  },
  labelContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9ca3af',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sliderContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  track: {
    position: 'relative',
    width: 6,
    backgroundColor: '#282828ff',
    borderRadius: 3,
    marginTop: 20,
  },
  fill: {
    position: 'absolute',
    width: 6,
    borderRadius: 3,
  },
  zeroLine: {
    position: 'absolute',
    width: 12,
    height: 2,
    backgroundColor: '#6b7280',
    left: -3,
    zIndex: 2,
  },
  thumb: {
    position: 'absolute',
    width: 60,
    height: 24,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
  },
  thumbInner: {
    width: 12,
    height: 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 1,
  },
  tickContainer: {
    position: 'absolute',
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tick: {
    width: 6,
    height: 1,
    backgroundColor: '#4b5563',
  },
  tickLabel: {
    fontSize: 9,
    color: '#6b7280',
    marginLeft: 6,
    fontWeight: '500',
    minWidth: 24,
  },
  valueContainer: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#2d2d2d',
    borderRadius: 4,
    minWidth: 70,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 13,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
});


export default VerticalSlider;
