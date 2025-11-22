import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput as _TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';
import * as SecureStore from 'expo-secure-store';

import TextInput from '@/components/ui/TextInput';
import Button from '@/components/ui/Button';
import CodeInput from '@/components/ui/CodeInput';
import { GradientBackground } from '@/components/ui/Gradients';

type Screen = 'phone' | 'otp';

const LoginView: React.FC = () => {
  const router = useRouter();

  const [screen, setScreen] = useState<Screen>('phone');
  const [phone, setPhone] = useState<string>('');
  const [otp, setOtp] = useState<string>('');

  const formatPhoneNumber = (text: string): string => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (match) {
      return [match[1], match[2], match[3]].filter(Boolean).join('-');
    }
    return text;
  };

  const handlePhoneChange = (text: string): void => {
    const formatted = formatPhoneNumber(text);
    setPhone(formatted);
  };

  const handleSendCode = async (): Promise<void> => {
    if (phone.replace(/\D/g, '').length === 10) {
      const { data, error } = await authClient.phoneNumber.sendOtp({
        phoneNumber: '+1' + phone.replace(/-/g, ''),
      });

      if (error) {
        Toast.error('Failed to send code');
        return;
      }

      setScreen('otp');
    }
  };

  const handleOtpChange = (newOtp: string) => setOtp(newOtp);

  const handleSubmitOtp = async (): Promise<void> => {
    if (otp.length === 6) {
      const { data, error } = await authClient.phoneNumber.verify({
        phoneNumber: '+1' + phone.replace(/-/g, ''),
        code: otp,
        disableSession: false,
        updatePhoneNumber: false,
      },
        {
          onSuccess: (ctx) => {
            console.log(ctx)
            const authToken = ctx.response.headers.get("set-auth-token") // get the token from the response headers
            // Store the token securely (e.g., in localStorage)
            console.log("bearer_token", authToken);
          }
        });
      console.log('on submit otp', data)
      if (error) {
        Toast.error('Failed to verify code.');
        return;
      }

      Toast.success('Signed in!');
      router.push('/');
    }
  };

  const handleBackToPhone = (): void => {
    setScreen('phone');
    setOtp('');
  };

  const isPhoneValid = phone.replace(/\D/g, '').length === 10;
  const isOtpValid = otp.length === 6;

  if (screen === 'phone') {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <GradientBackground color="#6f6f6fff" />
        <View style={styles.content}>
          <Text style={styles.title}>Login</Text>
          <Text style={styles.subtitle}>Enter your phone number{`\n`}to send code to</Text>
          <TextInput
            fullWidth
            placeholder="212-555-4567"
            value={phone}
            onChangeText={handlePhoneChange}
            keyboardType="phone-pad"
            maxLength={12}
          />
          <Button
            title="Send Code"
            fullWidth
            onPress={handleSendCode}
            disabled={!isPhoneValid}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <GradientBackground color="#7e8f9bff" />
      <View style={styles.content}>
        <Text style={styles.title}>Verify Code</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit code sent to{`\n`}{phone}
        </Text>
        <CodeInput value={otp} onChange={handleOtpChange} />

        <Button
          title="Submit"
          onPress={handleSubmitOtp}
          disabled={!isOtpValid}
        />
        <Button
          className="mt-4"
          variant="text"
          title="Change Phone Number"
          onPress={handleBackToPhone}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontFamily: 'dubsteptrix',
    fontSize: 40,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 25,
  },
  subtitle: {
    fontFamily: 'AkkuratMono',
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    marginTop: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default LoginView;
