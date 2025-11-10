import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';

import { getLobbyData } from '@/services/lobby';

import EditLobbyView from '@/views/EditLobbyView';

// TO DO implement environments
const hostname = 'http://localhost:8787';

const EditLobbyPage = () => {
  const params = useLocalSearchParams();
  const { lobbyId } = params;

  const [lobbyData, setLobbyData] = useState<LobbyEntry | null>(null);
  const [title, setTitle] = useState<string>('');
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLobbyData(lobbyId.toString(), (entry) => {
      const imageList = entry.images?.map((image) => ({
        ...image,
        url: `${hostname}/image/${lobbyId}/${image._id}`,
      }));
      setImages(imageList);
      setTitle(entry?.title);
      setLobbyData(entry);
      setLoading(false);
    });
  }, []);

  if (lobbyData && typeof lobbyId === 'string') {
    return <EditLobbyView lobbyId={lobbyId} initialImages={images} initialTitle={title} />;
  }
}

export default EditLobbyPage;
