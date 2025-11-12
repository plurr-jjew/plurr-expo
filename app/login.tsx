import React from 'react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';

import LoginView from '@/views/LoginView';

const LoginPage: React.FC = () => {
  const rootNavigationState = useRootNavigationState();
  const { data: session, isPending } = authClient.useSession();

  if (rootNavigationState?.key && session?.user.id && !isPending) {
    // Toast.error('Already logged in.');
    return <Redirect href="/" />;
  }

  return (
    <LoginView />
  );
};

export default LoginPage;