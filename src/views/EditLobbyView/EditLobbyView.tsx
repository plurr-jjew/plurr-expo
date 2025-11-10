import React, { useState } from 'react';
import { View, Text, Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { updateLobbyEntry } from '@/services/lobby';
import LobbyEditor from '@/components/LobbyEditor';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';

interface EditLobbyProps {
  lobbyId: string;
  initialImages: ImageEntry[];
  initialTitle: string;
}

const EditLobbyView: React.FC<EditLobbyProps> = ({ lobbyId, initialImages, initialTitle }) => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const router = useRouter();

  const [images, setImages] = useState<ImageEntry[]>(initialImages);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>(initialTitle);
  const [loading, setLoading] = useState<boolean>(false);

  const onImageDelete = (id: string) => {
    setDeletedImages((prev) => [...prev, id]);
  };

  const handleSubmitChanges = async () => {
    await updateLobbyEntry(title, deletedImages);
    router.push(`/lobby/${lobbyId}`);
  };

  console.log(deletedImages)

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex h-screen w-screen" edges={['top']}>
        <Animated.ScrollView
          ref={scrollableRef}
          style={{ height: '100%', width: '100%' }}
        >
          <View className="flex items-center px-5">
            <Text className="text-3xl font-bold mb-6">Edit Lobby</Text>
            <TextInput
              className="mb-4"
              label="Lobby Name"
              defaultValue={title}
              onChangeText={setTitle}
            />
            <Button
              className="mb-3"
              title="Save changes"
              LeadingIcon={<MaterialCommunityIcons name="file-image-plus" size={24} color="black" />}
              onPress={handleSubmitChanges}
            />
          </View>
          <LobbyEditor
            images={images}
            setImages={setImages}
            onImageDelete={onImageDelete}
            scrollRef={scrollableRef}
          />
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default EditLobbyView;
