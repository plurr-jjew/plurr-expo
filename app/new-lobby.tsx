import 'react-native-gesture-handler';

import React from 'react';
import { Redirect, useRootNavigationState, useLocalSearchParams } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';
import NewLobbyView from '@/views/NewLobbyView';

const NewLobbyPage = () => {
  const rootNavigationState = useRootNavigationState();
  const local = useLocalSearchParams();
  const { data: session, isPending } = authClient.useSession();

  console.log(local)

  if (rootNavigationState?.key && !session?.user.id && !isPending) {
    Toast.error('Please login to create lobby.');
    return <Redirect href="/" />;
  }
  if (!session?.user.id) {
    return null;
  }

  return (
    <NewLobbyView
      userId={session?.user.id}
      initialH={local.h ? Number(local.h) : undefined}
      initialS={local.s ? Number(local.s) : undefined}
      initialV={local.v ? Number(local.v) : undefined}
    />
  );
}

export default NewLobbyPage;
