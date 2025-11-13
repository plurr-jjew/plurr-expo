import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getLobbyData } from '@/services/lobby';
import ImageGalleryView from '@/views/ImageGalleryView';

const LobbyPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lobbyId } = params;

  const [lobbyData, setLobbyData] = useState<LobbyEntry | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleGetData = async () => {
    setLoading(true);

    await getLobbyData(lobbyId.toString(), (err, entry) => {
      setLoading(false);
      if (err) {
        router.push('/');
        return;
      } else {
        setLobbyData(entry);
      }
    });
  }
  console.log('lobbyData', lobbyData)

  useEffect(() => {
    handleGetData();
    console.log('useEffect hit');
  }, [lobbyId]);
  console.log('isLoading', loading);
  if (loading) return null;

  if (lobbyData) {
    return (
      <ImageGalleryView {...lobbyData} initialImages={lobbyData.images} />
    );
  }
}

export default LobbyPage;
