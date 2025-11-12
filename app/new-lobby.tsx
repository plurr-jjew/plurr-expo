import 'react-native-gesture-handler';

import React from 'react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';
import NewLobbyView from '@/views/NewLobbyView';

const NewLobbyPage = () => {
  const rootNavigationState = useRootNavigationState();
  const { data: session, isPending } = authClient.useSession();

  if (rootNavigationState?.key && !session?.user.id && !isPending) {
    Toast.error('Please login to create lobby.');
    return <Redirect href="/" />;
  }
  if (!session?.user.id) {
    return null;
  }

  return <NewLobbyView userId={session?.user.id} />;
}

export default NewLobbyPage;
