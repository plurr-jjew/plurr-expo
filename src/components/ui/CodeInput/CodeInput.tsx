import React, { useRef } from 'react';
import { StyleSheet, View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

function stringToPaddedArray(str: string) {
  const arr = str.split('');
  while (arr.length < 6) {
    arr.push('');
  }
  return arr.slice(0, 6);
}

interface CodeInputProps {
  value: string;
  onChange: (otp: string) => void;
}

const CodeInput: React.FC<CodeInputProps> = ({
  value,
  onChange,
}) => {
  const otp = stringToPaddedArray(value);
  const otpInputs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (text: string, index: number): void => {
    let digit = text;
    if (text.length > 1) {
      digit = text.slice(-1);
    }
    const newOtp = [...otp];
    newOtp[index] = digit;
    onChange(newOtp.join(''));
    // Auto-focus next input
    if (digit && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyPress = (
    e: NativeSyntheticEvent<TextInputKeyPressEventData>,
    index: number
  ): void => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  return (
    <View style={styles.otpContainer}>
      {otp.map((digit, index) => (
        <TextInput
          key={index}
          ref={(ref) => otpInputs.current[index] = ref}
          style={styles.otpInput}
          value={digit}
          onChangeText={(text) => handleOtpChange(text, index)}
          onKeyPress={(e) => handleOtpKeyPress(e, index)}
          keyboardType="number-pad"
          maxLength={1}
          selectTextOnFocus
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 50,
    height: 60,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default CodeInput;
