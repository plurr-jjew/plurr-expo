import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';

import Entypo from '@expo/vector-icons/Entypo';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

import { updateLobbyEntry, deleteLobbyEntry } from '@/services/lobby';
import LobbyEditor from '@/components/LobbyEditor';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';
import TextInput from '@/components/ui/TextInput';
import Switch from '@/components/ui/Switch';

interface EditLobbyProps {
  lobbyId: string;
  initialImages: ImageEntry[];
  initialTitle: string;
  initialViewersCanEdit: boolean;
}

const EditLobbyView: React.FC<EditLobbyProps> = ({
  lobbyId,
  initialImages,
  initialTitle,
  initialViewersCanEdit,
}) => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const router = useRouter();

  const [images, setImages] = useState<ImageEntry[]>(initialImages);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [title, setTitle] = useState<string>(initialTitle);
  const [viewersCanEdit, setViewersCanEdit] = useState<boolean>(initialViewersCanEdit);
  const [loading, setLoading] = useState<boolean>(false);

  const onImageDelete = (id: string) => {
    setDeletedImages((prev) => [...prev, id]);
  };

  const handleDelete = async () => {
    await deleteLobbyEntry(lobbyId, (error) => {
      if (error) {
        Toast.error('Failed to delete lobby.');
        return;
      }
      Toast.success('Deleted lobby!');
      router.push('/');
    });
  };

  const handleSubmitChanges = async () => {
    await updateLobbyEntry(lobbyId, title, images, viewersCanEdit, deletedImages);
    router.push(`/lobby/${lobbyId}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex h-screen w-screen" edges={['top']}>
        <Animated.ScrollView
          ref={scrollableRef}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            paddingVertical: 15,
          }}
        >
          <Text className="text-3xl font-bold mb-6 text-center">Edit Lobby</Text>
          <IconButton
            className="absolute right-3 top-0"
            Icon={<MaterialIcons name="delete" size={24} color="black" />}
            onPress={handleDelete}
          />
          <View className="flex items-center px-5 gap-4">
            <TextInput
              label="Lobby Name"
              value={title}
              maxLength={50}
              onChangeText={setTitle}
            />
            <Switch
              className="mb-3"
              label="Viewers can edit"
              value={viewersCanEdit}
              onChange={() => setViewersCanEdit((previousState) => !previousState)}
            />
            <Button
              title="Save changes"
              LeadingIcon={<Entypo name="save" size={24} color="white" />}
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
