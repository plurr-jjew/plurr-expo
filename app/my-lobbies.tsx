import React, { useEffect, useState } from 'react';
import { Redirect, useRootNavigationState } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';
import { getUserLobbies } from '@/services/lobby';
import MyLobbiesView from '@/views/MyLobbiesView';

const MyLobbiesPage: React.FC = () => {
  const rootNavigationState = useRootNavigationState();
  const { data: session, isPending } = authClient.useSession();

  const [lobbies, setLobbies] = useState<LobbyEntry[]>([]);

  useEffect(() => {
    if (session?.user.id) {
      getUserLobbies(session.user.id, (err, lobbyList) => {
        if (err || !lobbyList) {
          Toast.error('Failed to fetch lobbies');
          return;
        }
        setLobbies(lobbyList);
      });
    }
  }, [session, isPending]);

  if (rootNavigationState?.key && !session?.user.id && !isPending) {
    Toast.error('Please login.');
    return <Redirect href="/" />;
  }
  if (!session?.user.id) {
    return null;
  }
  return <MyLobbiesView lobbies={lobbies} />;
};

export default MyLobbiesPage;