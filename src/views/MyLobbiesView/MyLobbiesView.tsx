import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Link } from 'expo-router';

import LobbyGallery from '@/components/LobbyGallery/LobbyGallery';
import Button from '@/components/ui/Button';

interface MyLobbiesProps {
  lobbies: LobbyEntry[];
}

const MyLobbiesView: React.FC<MyLobbiesProps> = ({ lobbies }) => {
  return (
    <View style={styles.container}>
      <Link href="/new-lobby" asChild>
        <Button
          className="mt-2 mb-5"
          fullWidth
          title="New Lobby"
        />
      </Link>
      <LobbyGallery lobbies={lobbies} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 12,
    flex: 1,
  }
});

export default MyLobbiesView;
