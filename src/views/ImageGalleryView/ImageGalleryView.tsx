import React from 'react';
import { View , Text, Image } from 'react-native';

import ImageGallery from '@/components/ImageGallery';

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
      <ImageGallery images={images.map((image) => `http://${image.url}`)} />
    </View>
  );
}

export default ImageGalleryView;
