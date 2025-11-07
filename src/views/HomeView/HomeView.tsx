import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { useRouter, Link } from 'expo-router';

import { findLobbyByCode } from '@/services/lobby';

import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';

const HomeView = () => {
  const router = useRouter();

  const [lobbyCode, setLobbyCode] = useState<string>('');

  const handleJoinLobby = () => {
    // router.navigate(`/lobby/`);
    findLobbyByCode(
      lobbyCode,
      (lobbyId) => router.push(`/lobby/${lobbyId}`)
    );
  };

  return (
    <View className={styles.container}>
      <Text className={styles.title}>Plurr</Text>
      <TextInput
        className="mb-4"
        label="Lobby Code"
        placeholder="ABC123"
        defaultValue={lobbyCode}
        onChangeText={setLobbyCode}
        hasButton
        buttonTitle='Join'
        onButtonPress={handleJoinLobby}
      />
      <Link href="/new-lobby" asChild>
        <Button
          title="Host Lobby"
        />
      </Link>
    </View>
  );
};

export default HomeView;
const styles = {
  container: `items-center flex-1 justify-center bg-white gap-2`,
  title: `text-3xl font-bold mb-4`,
};
