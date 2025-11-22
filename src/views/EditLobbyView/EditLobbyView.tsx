import React, { useState } from 'react';
import { View, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useRouter, Link } from 'expo-router';
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
import { GradientBackground } from '@/components/ui/Gradients';

interface EditLobbyProps {
  lobbyId: string;
  backgroundColor: string;
  initialImages: ImageEntry[];
  initialTitle: string;
  initialViewersCanEdit: boolean;
}

const EditLobbyView: React.FC<EditLobbyProps> = ({
  lobbyId,
  backgroundColor,
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
    setImages(images.filter((image) => image._id !== id));
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
    const res = await updateLobbyEntry(
      lobbyId,
      {
        title,
        viewersCanEdit,
        images: images.map((image) => image._id), 
      },
      [],
      deletedImages
    );
    if (!res) {
      Toast.error('Failed to save chanages');
      return;
    }
    Toast.success('Updated lobby!');
    router.push(`/lobby/${lobbyId}`);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <GradientBackground color={backgroundColor} />
        <Animated.ScrollView
          ref={scrollableRef}
          style={{
            position: 'relative',
            height: '100%',
            width: '100%',
            paddingVertical: 15,
          }}
        >
          <Text style={styles.title}>Edit Lobby</Text>
          <IconButton
            className="absolute right-3 top-0"
            Icon={<MaterialIcons name="delete" size={24} color="black" />}
            onPress={handleDelete}
          />
          <View className="flex items-center px-10 gap-4">
            <TextInput
              label="Lobby Name"
              fullWidth
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
            <View style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 3,
              marginTop: 10,
              marginBottom: 15,
            }}>
              <Button
                title="Save"
                LeadingIcon={<Entypo name="save" size={20} color="white" />}
                onPress={handleSubmitChanges}
              />
              <Link href={`/lobby/${lobbyId}`} asChild>
                <Button
                  title="Cancel"
                  variant="text"
                />
              </Link>
            </View>
          </View>
          <LobbyEditor
            images={images}
            setImages={setImages}
            onImageDelete={onImageDelete}
            backgroundColor={backgroundColor}
            scrollRef={scrollableRef}
          />
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  title: {
    fontFamily: 'dubsteptrix',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 35,
  }
})

export default EditLobbyView;
