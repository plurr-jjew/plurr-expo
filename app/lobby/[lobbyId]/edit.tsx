import 'react-native-gesture-handler';

import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { getLobbyData } from '@/services/lobby';

import EditLobbyView from '@/views/EditLobbyView';

// TO DO implement environments
const hostname = 'http://localhost:8787';

const EditLobbyPage = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { lobbyId } = params;

  const [lobbyData, setLobbyData] = useState<LobbyEntry | null>(null);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    getLobbyData(lobbyId.toString(), (err, entry) => {
      if (err) {
        router.push('/');
        return;
      }
      if (entry) {
        const imageList = entry.images?.map((image) => ({
          ...image,
          url: `${hostname}/image/${lobbyId}/${image._id}`,
        }));
        setImages(imageList);
        setLobbyData(entry);
        setLoading(false);
      }
    });
  }, []);

  if (lobbyData && typeof lobbyId === 'string') {
    return (
      <EditLobbyView
        lobbyId={lobbyId}
        backgroundColor={lobbyData.backgroundColor}
        initialImages={images}
        initialTitle={lobbyData.title}
        initialViewersCanEdit={lobbyData.viewersCanEdit}
      />
    );
  }
}

export default EditLobbyPage;
