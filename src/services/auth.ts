
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { phoneNumberClient } from 'better-auth/client/plugins'

import * as SecureStore from 'expo-secure-store';

const hostname = process.env.EXPO_PUBLIC_API_URL;

export const authClient = createAuthClient({
  baseURL: hostname, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'plurr',
      storagePrefix: 'plurr',
      storage: SecureStore,
    }),
    phoneNumberClient(),
  ]
});