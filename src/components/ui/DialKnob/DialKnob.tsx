import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, GestureResponderEvent } from 'react-native';
import Svg, { Circle, Line, Path } from 'react-native-svg';

interface RotaryDialProps {
  size?: number;
  min?: number;
  max?: number;
  value?: number;
  step?: number;
  label?: string;
  unit?: string;
  showTicks?: boolean;
  tickCount?: number;
  onValueChange?: (value: number) => void;
}

const RotaryDial: React.FC<RotaryDialProps> = ({
  size = 150,
  min = 0,
  max = 100,
  value = 0,
  step = 1,
  label = '',
  unit = '',
  showTicks = true,
  tickCount = 12,
  onValueChange
}) => {
  const isDraggingRef = useRef<boolean>(false);
  const lastAngleRef = useRef<number>(0);
  const rotationsRef = useRef<number>(0);
  const totalAngleRef = useRef<number>(0);

  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  // Initialize refs when value changes externally (not during drag)
  React.useEffect(() => {
    if (!isDraggingRef.current) {
      // Preserve the current rotation count, just update the position within that rotation
      const targetAngle = valueToAngle(value) % 360;
      const currentRotations = Math.floor(totalAngleRef.current / 360);
      totalAngleRef.current = currentRotations * 360 + targetAngle;
      lastAngleRef.current = targetAngle;
    }
  }, [value]);

  const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

  const calculateAngleFromPosition = (x: number, y: number) => {
    const dx = x - centerX;
    const dy = y - centerY;
    let angle = Math.atan2(dy, dx) * (180 / Math.PI);
    angle += 90; // Adjust so 0 degrees is at top
    if (angle < 0) angle += 360;
    return angle;
  };

  const valueToAngle = (val: number) => {
    const percentage = (val - min) / (max - min);
    return percentage * 360; // Full 360 degree rotation
  };

  const angleToValue = (totalAngle: number) => {
    // Map total angle (which can be > 360) to value
    const percentage = (totalAngle % 360) / 360;
    let newValue = min + percentage * (max - min);

    // Apply step
    newValue = Math.round(newValue / step) * step;

    // Clamp to min/max
    return Math.max(min, Math.min(max, newValue));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        isDraggingRef.current = true;
        const touch = evt.nativeEvent;
        lastAngleRef.current = calculateAngleFromPosition(touch.locationX, touch.locationY);
      },
      onPanResponderMove: (evt: GestureResponderEvent) => {
        const touch = evt.nativeEvent;
        const currentAngle = calculateAngleFromPosition(touch.locationX, touch.locationY);

        // Calculate the shortest angular distance
        let deltaAngle = currentAngle - lastAngleRef.current;

        // Handle wraparound (crossing 0/360 boundary)
        if (deltaAngle > 180) {
          deltaAngle -= 360;
        } else if (deltaAngle < -180) {
          deltaAngle += 360;
        }

        // Update total angle (no limits, can rotate infinitely)
        totalAngleRef.current += deltaAngle;

        // Update last angle
        lastAngleRef.current = currentAngle;

        // Calculate new value
        const newValue = angleToValue(totalAngleRef.current);

        if (onValueChange && newValue !== value) {
          onValueChange(newValue);
        }
      },
      onPanResponderRelease: () => {
        isDraggingRef.current = false;
      },
      onPanResponderTerminate: () => {
        isDraggingRef.current = false;
      },
    })
  ).current;

  // Calculate current angle for display (0-360)
  const displayAngle = (valueToAngle(value) % 360);
  const currentRad = degreesToRadians(displayAngle);

  // Calculate indicator position
  const indicatorLength = radius;
  const indicatorX = centerX + indicatorLength * Math.sin(currentRad);
  const indicatorY = centerY - indicatorLength * Math.cos(currentRad);

  // Generate tick marks
  const ticks = [];
  for (let i = 0; i < tickCount; i++) {
    const angle = (i / tickCount) * 360;
    const rad = degreesToRadians(angle);
    const tickStartRadius = radius - 5;
    const tickEndRadius = radius + 5;

    const x1 = centerX + tickStartRadius * Math.sin(rad);
    const y1 = centerY - tickStartRadius * Math.cos(rad);
    const x2 = centerX + tickEndRadius * Math.sin(rad);
    const y2 = centerY - tickEndRadius * Math.cos(rad);

    ticks.push(
      <Line
        key={i}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={i % 3 === 0 ? "#6b728083" : "#4b5563b1"}
        strokeWidth={i % 3 === 0 ? 2 : 1}
      />
    );
  }

  // Create circular track
  const trackRadius = radius;
  const trackPath = `M ${centerX} ${centerY - trackRadius} 
                      A ${trackRadius} ${trackRadius} 0 1 1 ${centerX - 0.001} ${centerY - trackRadius}`;

  // Create progress arc (from 0 to current value)
  const progressAngle = displayAngle;
  const progressRad = degreesToRadians(progressAngle);
  const progressX = centerX + trackRadius * Math.sin(progressRad);
  const progressY = centerY - trackRadius * Math.cos(progressRad);
  const largeArc = progressAngle > 180 ? 1 : 0;

  const progressPath = progressAngle > 0
    ? `M ${centerX} ${centerY - trackRadius} A ${trackRadius} ${trackRadius} 0 ${largeArc} 1 ${progressX} ${progressY}`
    : '';

  return (
    <View style={styles.container}>
      {label ? (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>{label}</Text>
        </View>
      ) : null}

      <View
        {...panResponder.panHandlers}
        style={[styles.dialContainer, { width: size, height: size }]}
      >
        <Svg width={size} height={size}>
          {/* Outer ring */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius + 8}
            fill="#000"
            stroke="#1a1a1a"
            strokeWidth="2"
          />

          {/* Track (background circle) */}
          {/* <Path
            d={trackPath}
            stroke="#2d2d2d"
            strokeWidth="6"
            fill="none"
            strokeLinecap="round"
          /> */}

          {/* Progress arc */}
          {/* {progressPath && (
            <Path
              d={progressPath}
              stroke="#4c4c4c45"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
            />
          )} */}

          {/* Tick marks */}
          {showTicks && ticks}

          {/* Center knob */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius - 30}
            fill="#000000"
            stroke="#2d2d2d"
            strokeWidth="3"
          />

          {/* Indicator line */}
          {/* <Line
            x1={centerX}
            y1={centerY}
            x2={indicatorX}
            y2={indicatorY}
            stroke="#3b82f6"
            strokeWidth="3"
            strokeLinecap="round"
          /> */}

          {/* Indicator dot */}
          <Circle
            cx={indicatorX}
            cy={indicatorY}
            r="5"
            fill="#b52626ff"
          />

          {/* Center dot */}
          <Circle
            cx={centerX}
            cy={centerY}
            r="4"
            fill="#4b5563a4"
          />
        </Svg>

        {/* Value display */}
        {/* <View style={styles.valueDisplay}>
          <Text style={styles.valueText}>
            {value.toFixed(step < 1 ? 1 : 0)}
          </Text>
          {unit ? <Text style={styles.unitText}>{unit}</Text> : null}
        </View> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    padding: 8,
  },
  labelContainer: {
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  dialContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  valueDisplay: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#f3f4f6',
    fontFamily: 'monospace',
  },
  unitText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#9ca3af',
    marginTop: 2,
  },
});

export default RotaryDial;