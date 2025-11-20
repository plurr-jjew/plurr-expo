import React, { useState, useMemo } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  Modal,
  FlatList,
  useWindowDimensions,
} from 'react-native';
import { Toast } from 'toastify-react-native';

import ImageCarousel from '@/components/ImageCarousel';
import ReactionButton from '@/components/ui/ReactionButton';
import { handleReact } from '@/services/image';

type ImageGalleryProps = {
  images: ImageEntry[]; // Array of image URIs (URLs)
  backgroundColor: string;
  spacing?: number; // Spacing between images
};

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  backgroundColor,
  spacing = 15,
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const { width: SCREEN_WIDTH } = useWindowDimensions();

  // Dynamically calculate number of columns based on screen width
  const getColumns = () => {
    if (SCREEN_WIDTH >= 1100) return 5;
    if (SCREEN_WIDTH >= 700) return 4;
    if (SCREEN_WIDTH >= 500) return 3;
    return 2;
  };

  const columns = getColumns(); // Get the responsive column count

  const thumbnailSize = (SCREEN_WIDTH - spacing * (columns + 1)) / columns - 20;

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
  const translateValues = useMemo(() => images.map((image) => ({
    transX: getRandomNumber(-2, 2),
    transY: getRandomNumber(-10, 10),
    rotation: getRandomNumber(-5, 5),
  })), [images]);

  const renderThumbnail = ({ item, index }: { item: ImageEntry; index: number }) => (
    <View style={{
      position: 'relative',
      overflow: 'hidden',
      margin: spacing / 2,
      backgroundColor: '#fffcf6ff',
      paddingHorizontal: 10,
      paddingVertical: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      // transform: [
      //   { rotate: `${translateValues[index].rotation}deg` },
      //   { translateX: translateValues[index].transX },
      //   { translateY: translateValues[index].transY }
      // ]
    }}>
      <View style={{
        borderColor: '#00000023',
        borderWidth: 1,
      }}>
        <TouchableOpacity
          style={{
            width: thumbnailSize,
            height: thumbnailSize,
            overflow: 'hidden',
            backgroundColor: '#989898ff',
          }}
          onPress={() => openImage(index)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: item.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
        </TouchableOpacity>
      </View>
      <View style={{ position: 'relative', height: 25 }}>
        <ReactionButton
          styles={{ position: 'aboslute', left: 0, top: 5 }}
          imageId={item._id}
          reactionString={item.reactionString ? item.reactionString : '0'}
          initialReaction={item.currentUserReaction ? item.currentUserReaction : null}
        
        />
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ paddingVertical: 5 }}
        key={`flatlist-${columns}cols`}
        data={images}
        renderItem={renderThumbnail}
        keyExtractor={(item, index) => index.toString()}
        numColumns={columns}
        contentContainerStyle={{
          padding: spacing / 2,
        }}
      />
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <ImageCarousel
          images={images.map((image) => image.url)}
          backgroundColor={backgroundColor}
          initialSelectedIndex={selectedIndex}
          closeModal={closeModal}
        />
      </Modal>
    </View>
  );
};

export default ImageGallery;
