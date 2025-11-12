import React from 'react';
import { ScrollView, View } from 'react-native';
import { Link } from 'expo-router';

import LobbyGallery from '@/components/LobbyGallery/LobbyGallery';
import Button from '@/components/ui/Button';

interface MyLobbiesProps {
  lobbies: LobbyEntry[];
}

const MyLobbiesView: React.FC<MyLobbiesProps> = ({ lobbies }) => {
  return (
    <ScrollView style={{ padding: 10 }}>
      <View style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <Link href="/new-lobby" asChild>
          <Button
            className="mt-2 mb-5"
            fullWidth
            title="New Lobby"
          />
        </Link>
        <LobbyGallery lobbies={lobbies} />
      </View>
    </ScrollView>
  );
};

export default MyLobbiesView;
