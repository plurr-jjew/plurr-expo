import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { getLobbyData } from '@/services/lobby';
import ImageGalleryView from '@/views/ImageGalleryView';

const LobbyPage = () => {
  const params = useLocalSearchParams();
  const { lobbyId } = params;

  const [lobbyData, setLobbyData] = useState<LobbyEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLobbyData(lobbyId.toString(), (entry) => {
      setLobbyData(entry);
      setLoading(false);
    });
  }, []);

  if (lobbyData) {
    return (
      <ImageGalleryView {...lobbyData} />
    );
  }
}

export default LobbyPage;
