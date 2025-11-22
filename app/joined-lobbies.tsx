import React, { useEffect, useState } from 'react';
import { Redirect, useRootNavigationState, useRouter } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { authClient } from '@/services/auth';
import { getJoinedLobbies } from '@/services/lobby';
import JoinedLobbiesView from '@/views/JoinedLobbiesView';

const JoinedLobbiesPage: React.FC = () => {
  const router = useRouter();
  const rootNavigationState = useRootNavigationState();
  const { data: session, isPending } = authClient.useSession();

  const [lobbies, setLobbies] = useState<LobbyEntry[]>([]);

  useEffect(() => {
    if (session?.user.id) {
      getJoinedLobbies(session.user.id, (err, lobbyList) => {
        if (err || !lobbyList) {
          Toast.error('Failed to fetch lobbies');
          router.push('/');
          return;
        }
        setLobbies(lobbyList);
      });
    }
    if (!session && !isPending) {
      Toast.error('Please login.');
    }
  }, [session, isPending, rootNavigationState]);

  if (rootNavigationState?.key && !session?.user.id && !isPending) {
    return <Redirect href="/" />;
  }
  if (!session?.user.id) {
    return null;
  }
  return <JoinedLobbiesView lobbies={lobbies} />;
};

export default JoinedLobbiesPage;
