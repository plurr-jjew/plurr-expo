import React from 'react';
import { View, Text, Image } from 'react-native';
import { Link } from 'expo-router';

import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/ui/Button';

interface ImageGalleryViewProps {
  _id: string;
  createdOn: string;
  firstUploadOn: string;
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
  images,
  viewersCanEdit,
}) => {

  return (
    <View className="items-center flex-1 justify-center bg-white gap-2">
      <Text className="text-3xl font-bold mb-4">{title}</Text>
      <Link href={`/lobby/${_id}/edit`} asChild>
        <Button title="Edit" />
      </Link>
      <ImageGallery images={images.map((image) => `${hostname}/image/${_id}/${image._id}`)} />
    </View>
  );
}

export default ImageGalleryView;
