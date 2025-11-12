import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Link } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { findLobbyByCode } from '@/services/lobby';
import { authClient } from '@/services/auth';

import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';

const HomeView = () => {
  const router = useRouter();
  const { data: session } = authClient.useSession();

  const [lobbyCode, setLobbyCode] = useState<string>('');

  const handleJoinLobby = () => {
    if (/^[A-Za-z0-9]{6}$/.test(lobbyCode)) {
      findLobbyByCode(
        lobbyCode,
        (lobbyId) => router.push(`/lobby/${lobbyId}`)
      );
    } else {
      Toast.error('Please enter valid code');
    }
  };

  const handleSignOut = async () => {
    await authClient.signOut();
  }

  return (
    <View className="items-center relative flex-1 justify-center px-5 py-2 gap-2">
      {/* {!session ?
        <Link href="/login" asChild>
          <Button
            className="absolute top-2 right-2"
            variant="text"
            title="Login"
          />
        </Link> :
        <Button
          className="absolute top-2 right-2"
          title="Logout"
          variant="text"
          onPress={handleSignOut}
        />
      } */}
      <Image
        source={require('@/../assets/images/plurr-logo.png')}
        style={{ width: 200, height: 100}}
        contentFit='contain'
      />
      <Text className="text-md text-center mb-4">
        Do Now.{`\n`}
        Connect Later.
      </Text>
      <TextInput
        className="mb-4"
        label="Lobby Code"
        placeholder="ABC123"
        value={lobbyCode}
        maxLength={6}
        onChangeText={setLobbyCode}
        hasButton
        buttonTitle='Join'
        onButtonPress={handleJoinLobby}
      />
      <Link href="/new-lobby" asChild>
        <Button
          className="mt-8"
          fullWidth
          title="Host Lobby"
        />
      </Link>
    </View>
  );
};

export default HomeView;
