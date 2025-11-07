import React, { useState } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
} from 'react-native';

import { useWindowDimensions } from 'react-native';  // Hook to get the current screen size

import ImageCarousel from '@/components/ImageCarousel';

type ImageGalleryProps = {
  images: string[]; // Array of image URIs (URLs)
  spacing?: number; // Spacing between images
};

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, spacing = 4 }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // Dynamically calculate number of columns based on screen width
  const getColumns = () => {
    if (SCREEN_WIDTH >= 1200) return 5;
    if (SCREEN_WIDTH >= 900) return 4;
    if (SCREEN_WIDTH >= 600) return 3;
    return 2;
  };

  const columns = getColumns(); // Get the responsive column count

  const thumbnailSize = (SCREEN_WIDTH - spacing * (columns + 1)) / columns;

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const renderThumbnail = ({ item, index }: { item: string; index: number }) => (
    <TouchableOpacity
      style={{
        width: thumbnailSize,
        height: thumbnailSize,
        margin: spacing / 2,
        borderRadius: 8,
        overflow: 'hidden',
      }}
      onPress={() => openImage(index)}
      activeOpacity={0.8}
    >
      <Image source={{ uri: item }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <FlatList
        key={`flatlist-${columns}cols`}
        data={images}
        renderItem={renderThumbnail}
        keyExtractor={(item, index) => index.toString()}
        numColumns={columns}
        contentContainerStyle={{
          padding: spacing / 2,
        }}
        showsVerticalScrollIndicator={false}
      />

      <Modal
        visible={modalVisible}
        transparent={false}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ImageCarousel images={images} initialSelectedIndex={selectedIndex} closeModal={closeModal} />
      </Modal>
    </View>
  );
};

export default ImageGallery;
