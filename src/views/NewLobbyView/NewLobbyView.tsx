import React, { useState } from 'react';
import { View, Text, Alert, } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';

import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { submitNewLobby } from '@/services/lobby';
import LobbyEditor from '@/components/LobbyEditor';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';

const NewLobbyView: React.FC = () => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const router = useRouter();

  const [images, setImages] = useState<ImageEntry[]>([]);
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const pickImages = async () => {
    setLoading(true);
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Permission required", "Please allow photo access to upload images.");
      setLoading(false);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const formatPromises = result.assets.map(async (asset) => {
        const context = ImageManipulator.manipulate(asset.uri);
        context.resize({ height: 2000 });
        const image = await context.renderAsync();
        const result = await image.saveAsync({
          format: SaveFormat.JPEG,
          compress: 0.8,
        });
        return {
          _id: asset.assetId ?? asset.uri + Date.now(),
          url: result.uri,
        };
      });
      const newImages = await Promise.all(formatPromises);
      setImages((prev) => [...prev, ...newImages]);
    }
    setLoading(false);
  };

  const handleCreateLobby = async () => {
    await submitNewLobby(
      title,
      images,
      (lobbyId) => router.push(`/lobby/${lobbyId}`)
    );
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex h-screen w-screen" edges={['top']}>
        <Animated.ScrollView
          ref={scrollableRef}
          style={{ height: '100%', width: '100%' }}
        >
          <View className="flex items-center px-5">
            <Text className="text-3xl font-bold mb-6">New Lobby</Text>
            <TextInput
              className="mb-4"
              label="Lobby Name"
              defaultValue={title}
              onChangeText={setTitle}
              hasButton
              buttonTitle="Create"
              onButtonPress={handleCreateLobby}
            />
            <Button
              className="mb-3"
              title="Upload Images"
              LeadingIcon={<MaterialCommunityIcons name="file-image-plus" size={24} color="black" />}
              onPress={pickImages}
            />
          </View>
          <LobbyEditor images={images} setImages={setImages} scrollRef={scrollableRef} />
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

export default NewLobbyView;
