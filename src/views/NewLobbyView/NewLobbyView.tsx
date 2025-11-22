import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, DimensionValue } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Animated, { useAnimatedRef } from 'react-native-reanimated';
import { Toast } from 'toastify-react-native';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { createLobbyDraft, submitDraftLobby, submitNewLobby } from '@/services/lobby';
import { uploadImage } from '@/services/image';
import { pickImages } from '@/utils/imagePicker';

import { GradientBackground } from '@/components/ui/Gradients';
import LobbyEditor from '@/components/LobbyEditor';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import VerticalSlider from '@/components/ui/VerticalSlider';
import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import Switch from '@/components/ui/Switch';
import { hsvToHex } from '@/utils/colors';
import DialKnob from '@/components/ui/DialKnob';

interface NewLobbyProps {
  userId: string;
  initialH?: number;
  initialS?: number;
  initialV?: number;
}

interface UploadedImages {
  [key: string]: {
    isUploadComplete: boolean;
    dbId: string | null;
  }
}

const NewLobbyView: React.FC<NewLobbyProps> = ({
  userId,
  initialH = 40,
  initialS = 77,
  initialV = 90
}) => {
  const scrollableRef = useAnimatedRef<Animated.ScrollView>();
  const router = useRouter();

  const [lobbyId, setLobbyId] = useState<string | null>(null);
  const [images, setImages] = useState<ImageEntry[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImages>({});
  const [removedImageIds, setRemovedImageIds] = useState<string[]>([]);

  const [title, setTitle] = useState<string>('');
  const [viewersCanEdit, setViewersCanEdit] = useState<boolean>(true);

  const [hValue, setHValue] = useState<number>(initialH);
  const [sValue, setSValue] = useState<number>(initialS);
  const [vValue, setVValue] = useState<number>(initialV);

  const [loadingMsg, setLoadingMsg] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handlePickImages = async () => {
    setLoadingMsg('Processing images...');
    const newImages = await pickImages();
    setLoadingMsg(null);

    if (!newImages) return;
    setImages((prev) => [...prev, ...newImages]);
    Toast.success(`Added ${newImages.length} images`);

    let newLobbyId = lobbyId;
    if (!newLobbyId) {
      newLobbyId = await createLobbyDraft(
        userId,
        title,
        hexColor,
        viewersCanEdit,
      );
      if (!newLobbyId) {
        Toast.error('Failed to add images.');
        return;
      }
      setLobbyId(newLobbyId);
    }

    const newUploadedImages: UploadedImages = uploadedImages;
    newImages.forEach((image: ImageEntry) => {
      newUploadedImages[image._id] = {
        isUploadComplete: false,
        dbId: null,
      };
    });
    setUploadedImages(newUploadedImages);

    const uploadPromises = newImages.map(async (image) => {
      const localId = image._id;
      const dbImageId = await uploadImage(image, newLobbyId);
      if (dbImageId) {
        setUploadedImages((prev) => ({
          ...prev,
          [localId]: {
            isUploadComplete: true,
            dbId: dbImageId,
          }
        }));
      }
    });

    await Promise.all(uploadPromises);
  };

  const handleCreateLobby = async () => {
    if (title === '') {
      Toast.error('Please name lobby');
      return;
    }
    setLoadingMsg('Creating lobby...');
    setIsSubmitted(true);
  };

  const hexColor = hsvToHex(
    hValue,
    sValue > 100 ? 200 - sValue : sValue,
    vValue > 100 ? 200 - vValue : vValue
  );

  const handleSubmitDraft = async (imageList: string[], removedImageList: string[]) => {
    if (lobbyId) {
      const res = await submitDraftLobby(
        lobbyId,
        userId,
        title,
        hexColor,
        viewersCanEdit,
        imageList,
        removedImageList,
      );
      setLoadingMsg(null);
      setIsSubmitted(false);
      console.log(res)
      if (res) {
        setImages([]);
        setTitle('');
        setViewersCanEdit(true);
        router.push(`/lobby/${lobbyId}`);
      }
    }
  };

  useEffect(() => {
    if (isSubmitted) {
      const uploadValues = Object.values(uploadedImages);
      const isUploadComplete = !uploadValues.some((image) =>
        image.isUploadComplete === false || image.dbId === null
      );
      // console.log(uploadValues, isUploadComplete);
      if (isUploadComplete) {
        const imageList: string[] = [];
        const removedImageList: string[] = [];

        images.forEach((image) => {
          const dbId = uploadedImages[image._id]?.dbId;
          if (dbId) {
            imageList.push(dbId);
          }
        });
        removedImageIds.forEach((id) => {
          const dbId = uploadedImages[id]?.dbId;
          if (dbId) {
            removedImageList.push(dbId);
          }
        });
        console.log(imageList, removedImageList)
        handleSubmitDraft(imageList, removedImageList);
      }

    }
  }, [uploadedImages, isSubmitted]);
  console.log(uploadedImages, images, removedImageIds)
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }} edges={['top']}>
        <GradientBackground color={hexColor} />
        <LoadingOverlay show={loadingMsg !== null} text={loadingMsg} />
        <Animated.ScrollView
          ref={scrollableRef}
          style={{ height: '100%', width: '100%', paddingVertical: 10 }}
        >
          <View style={{
            display: 'flex',
            minHeight: '100%',
            width: '100%',
            paddingVertical: 0,
            justifyContent: images.length === 0 ? 'center' : 'flex-start',
          }}>
            <View style={styles.sliderContainer}>
              <DialKnob
                min={0}
                max={360}
                size={100}
                value={hValue}
                onValueChange={(newH) => setHValue(newH)}
              />
              <DialKnob
                min={0}
                max={200}
                size={100}
                value={sValue}
                onValueChange={(newS) => setSValue(newS)}
              />
              <DialKnob
                min={0}
                max={200}
                size={100}
                value={vValue}
                onValueChange={(newV) => setVValue(newV)}
              />
              {/* <VerticalSlider
                width={15}
                height={170}
                value={hValue}
                onChange={(newH) => setHValue(newH)}
                min={0}
                max={360}
                step={1}
                showIndicator
                indicatorLabel="H"
              />
              <VerticalSlider
                width={15}
                height={170}
                value={sValue}
                onChange={(newS) => setSValue(newS)}
                min={0}
                max={100}
                step={1}
                showIndicator
                indicatorLabel="S"
              />
              <VerticalSlider
                width={15}
                height={170}
                value={vValue}
                onChange={(newV) => setVValue(newV)}
                min={0}
                max={100}
                step={1}
                showIndicator
                indicatorLabel="V"
              /> */}
            </View>
            <Text
              style={{
                display: images.length === 0 ? 'flex' : 'none',
                justifyContent: 'center',
                fontFamily: 'dubsteptrix',
                fontSize: 24,
                lineHeight: 30,
              }}
              className="text-xl text-center mb-10">
              Add images to{`\n`}
              make this yours!
            </Text>
            <View className="flex items-center gap-4 px-16">
              <TextInput
                label="Lobby Name"
                value={title}
                fullWidth
                maxLength={50}
                onChangeText={setTitle}
                hasButton
                buttonTitle="Create"
                onButtonPress={handleCreateLobby}
              />
              <Switch
                className="mb-4"
                label="Viewers can upload"
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
              backgroundColor={hexColor}
              scrollRef={scrollableRef}
              isLoading={loadingMsg == null}
              onImageDelete={(id) => setRemovedImageIds((prev) => [...prev, id])}
            />
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  sliderContainer: {
    marginTop: 60,
    marginBottom: 80,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 0,
  },
});

export default NewLobbyView;
