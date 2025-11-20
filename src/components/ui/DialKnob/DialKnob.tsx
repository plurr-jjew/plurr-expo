import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';

interface DialKnobProps {
  size?: number;
  min?: number;
  max?: number;
  initialValue?: number;
  onValueChange?: (value: number) => void;
}

const DialKnob: React.FC<DialKnobProps> = ({ 
  size = 200, 
  min = 0, 
  max = 100, 
  initialValue = 50, 
  onValueChange 
}) => {
  const [value, setValue] = useState<number>(initialValue);
  const [rotation, setRotation] = useState<number>(((initialValue - min) / (max - min)) * 360);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const knobRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX, e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!knobRef.current) return;

    const rect = knobRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = clientX;
    const mouseY = clientY;
    
    // Calculate angle from center (-180 to 180)
    const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
    
    // Normalize to 0-360 degrees (0 at top)
    let normalizedAngle = angle + 90;
    if (normalizedAngle < 0) normalizedAngle += 360;

    let knobAngle = normalizedAngle - 225;
    if (knobAngle < -135) knobAngle = -135;
    if (knobAngle > 135) knobAngle = 135;
    
    
    setRotation(normalizedAngle);
    
    // Calculate value based on full 360 degree rotation
    const newValue = min + (normalizedAngle / 360) * (max - min);
    const roundedValue = Math.round(newValue);
    setValue(roundedValue);
    
    if (onValueChange) {
      onValueChange(roundedValue);
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <View style={styles.container}>
      <div
        ref={knobRef}
        style={{
          ...styles.knobContainer,
          width: size,
          height: size,
        }}
      >
        {/* Tick marks - 12 marks for full circle */}
        {[...Array(12)].map((_, i) => {
          const tickAngle = i * 30;
          return (
            <div
              key={i}
              style={{
                ...styles.tick,
                transform: `rotate(${tickAngle}deg) translateY(-${size / 2.5}px)`,
              }}
            />
          );
        })}
        
        {/* Knob */}
        <div
          onMouseDown={handleMouseDown}
          style={{
            ...styles.knob,
            width: size * 0.7,
            height: size * 0.7,
            borderRadius: size * 0.35,
            transform: `rotate(${rotation}deg)`,
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
        >
          <div style={styles.indicator} />
        </div>
        
        {/* Center dot */}
        <div style={styles.centerDot} />
      </div>
      
      {/* Value display */}
      <div style={styles.valueContainer}>
        <span style={styles.valueText}>{value}</span>
        <span style={styles.degreeText}>{Math.round(rotation)}°</span>
      </div>
    </View>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
  },
  knobContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tick: {
    position: 'absolute',
    width: '2px',
    height: '10px',
    backgroundColor: '#666',
  },
  knob: {
    backgroundColor: '#2c3e50',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: '15px',
    userSelect: 'none',
  },
  indicator: {
    width: '4px',
    height: '35px',
    backgroundColor: '#e74c3c',
    borderRadius: '2px',
  },
  centerDot: {
    position: 'absolute',
    width: '12px',
    height: '12px',
    borderRadius: '6px',
    backgroundColor: '#34495e',
    pointerEvents: 'none',
  },
  valueContainer: {
    marginTop: '30px',
    padding: '15px 25px',
    backgroundColor: '#ecf0f1',
    borderRadius: '8px',
    minWidth: '120px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  valueText: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  degreeText: {
    fontSize: '14px',
    color: '#7f8c8d',
    fontWeight: '500',
  },
};

export default DialKnob;
