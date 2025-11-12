import React from 'react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';

const LogoutPage: React.FC = () => {
  const rootNavigationState = useRootNavigationState();
  const { data: session, isPending } = authClient.useSession();
  console.log('logout test')
  const handleSignOut = async () => {
    await authClient.signOut();
    Toast.info('Logged out');
  }

  if (rootNavigationState?.key && !isPending) {
    if (session?.user.id) {
      handleSignOut();
    }
    return <Redirect href="/" />;
  }

  return null;
};

export default LogoutPage;
