import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { Link } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { addImagesToLobby } from '@/services/lobby';
import { pickImages } from '@/utils/imagePicker';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/ui/Button';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface ImageGalleryViewProps {
  _id: string;
  createdOn: string;
  firstUploadOn: string | null;
  ownerId: string;
  title: string;
  lobbyCode: string;
  images: ImageEntry[];
  viewersCanEdit: boolean;
}

// TO DO implement environments
const hostname = 'http://localhost:8787';

const ImageGalleryView: React.FC<ImageGalleryViewProps> = ({
  _id,
  createdOn,
  firstUploadOn,
  ownerId,
  title,
  lobbyCode,
  images: initialImages,
  viewersCanEdit,
}) => {
  const [images, setImages] = useState<ImageEntry[]>(initialImages);
  const [loading, setLoading] = useState<boolean>(false);
  const onPickImage = async (err: Error | null, newImages: ImageEntry[] | null) => {
    if (err || !newImages) {
      Toast.error('Failed to add images.');
      return;
    }
    await addImagesToLobby(_id, newImages, (err, _newImages: ImageEntry[] | null) => {
      if (err || !_newImages) {
        Toast.error('Failed to add images.');
        return;
      }
      setImages((prev) => [...prev, ..._newImages]);
      Toast.success(`Added ${_newImages.length} images`)
    });
  };

  const handleAddImages = async () => {
    setLoading(true);
    await pickImages(onPickImage);
    setLoading(false);
  };

  return (
    <View className="relative flex justify-center items-center flex-1 px-2 py-2 bg-white gap-2">
      <LoadingOverlay show={loading} />
      <Text className="text-3xl font-bold mb-4">{title}</Text>
      <View className="flex flex-row gap-2 justify-center align-center">
        <Link href={`/lobby/${_id}/edit`} asChild>
          <Button title="Edit" />
        </Link>
        <Button title="Add images" onPress={handleAddImages} />
      </View>
      <ImageGallery images={images.map((image) => `${hostname}/image/${_id}/${image._id}`)} />
    </View>
  );
}

export default ImageGalleryView;
