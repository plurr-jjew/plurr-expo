import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { submitNewLobby } from '@/services/lobby';
import { pickImages } from '@/utils/imagePicker';

import LobbyEditor from '@/components/LobbyEditor';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import Switch from '@/components/ui/Switch';

interface NewLobbyProps {
  userId: string;
}

const NewLobbyView: React.FC<NewLobbyProps> = ({ userId }) => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const router = useRouter();

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [title, setTitle] = useState<string>('');
  const [viewersCanEdit, setViewersCanEdit] = useState<boolean>(true);
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);

  const handlePickImages = async () => {
    setLoadingMsg('Processing images...');
    await pickImages((err, newImages) => {
      if (err || !newImages) {
        Toast.error('Failed to add images.');
        return;
      }
      setImages((prev) => [...prev, ...newImages]);
      Toast.success(`Added ${newImages.length} images`);
    });
    setLoadingMsg(null);
  };

  const handleCreateLobby = async () => {
    if (title === '') {
      Toast.error('Please name lobby');
      return;
    }
    setLoadingMsg('Creating lobby...');
    await submitNewLobby(
      userId,
      title,
      viewersCanEdit,
      images,
      (lobbyId) => router.push(`/lobby/${lobbyId}`)
    );
    setLoadingMsg(null);
    setImages([]);
    setTitle('');
    setViewersCanEdit(true);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="h-screen w-screen" edges={['top']}>
        <LoadingOverlay show={loadingMsg !== null} text={loadingMsg} />
        <Animated.ScrollView
          ref={scrollableRef}
          style={{ height: '100%', width: '100%', paddingVertical: 25 }}
        >
          <Text className="text-xl text-center mb-6">
            Add images to{`\n`}
            make this yours!
          </Text>
          <View className="flex items-center gap-4 px-5">
            <TextInput
              label="Lobby Name"
              value={title}
              maxLength={50}
              onChangeText={setTitle}
              hasButton
              buttonTitle="Create"
              onButtonPress={handleCreateLobby}
            />
            <Switch
              className="mb-4"
              label="Viewers can edit"
              value={viewersCanEdit}
              onChange={() => setViewersCanEdit((previousState) => !previousState)}
            />
            <Button
              className="mb-3"
              fullWidth
              title="Add Images"
              LeadingIcon={<MaterialCommunityIcons name="file-image-plus" size={24} color="white" />}
              onPress={handlePickImages}
            />
          </View>
          <LobbyEditor
            images={images}
            setImages={setImages}
            scrollRef={scrollableRef}
            isLoading={loadingMsg == null}
          />
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default NewLobbyView;
