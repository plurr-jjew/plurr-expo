
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import { phoneNumberClient } from 'better-auth/client/plugins'

import * as SecureStore from 'expo-secure-store';

// TO DO: implement endpoints corresponding to envs
const hostname = 'http://localhost:8787';

export const authClient = createAuthClient({
  baseURL: hostname, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'plurr',
      storagePrefix: 'myapp',
      storage: SecureStore,
    }),
    phoneNumberClient(),
  ]
});