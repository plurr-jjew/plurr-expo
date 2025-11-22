import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';
import {
  TouchableOpacity,
  Image,
  View,
  Modal,
  useWindowDimensions
} from 'react-native';
import type { SortableGridRenderItem } from 'react-native-sortables';
import Sortable from 'react-native-sortables';

import { Ionicons } from "@expo/vector-icons";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import ImageCarousel from '@/components/ImageCarousel';

interface LobbyEditorProps {
  images: ImageEntry[];
  setImages: Dispatch<SetStateAction<ImageEntry[]>>;
  onImageDelete?: (id: string) => void;
  backgroundColor: string;
  scrollRef: any;
  isLoading?: boolean;
}

const LobbyEditor: React.FC<LobbyEditorProps> = ({
  images,
  setImages,
  onImageDelete,
  backgroundColor,
  scrollRef,
  isLoading = false,
}) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);

  const thumbnailWidth = 165;
  const getColumns = () => {
    if (SCREEN_WIDTH >= thumbnailWidth * 5) return 5;
    if (SCREEN_WIDTH >= thumbnailWidth * 4) return 4;
    if (SCREEN_WIDTH >= thumbnailWidth * 3) return 3;
    if (SCREEN_WIDTH >= thumbnailWidth * 2) return 2;
    return 1;
  };

  const columns = getColumns();
  const spacing = 8;
  const thumbnailSize = (SCREEN_WIDTH - spacing * (columns + 1)) / columns - 10;

  const handleImageDelete = (id: string) => () => {
    setImages((prev) => prev.filter((img) => img._id !== id));
    if (onImageDelete) {
      console.log(onImageDelete);
      onImageDelete(id);
    }
  };

  const renderItem = useCallback<SortableGridRenderItem<ImageEntry>>(
    ({ item, index }) => (
      <TouchableOpacity
        onLongPress={(e) => e.preventDefault()}
        onPress={() => openImage(index)}
        activeOpacity={0.8}
        className={`relative m-1 findme`}
        style={{
          width: thumbnailSize,
          height: thumbnailSize,
          margin: spacing / 2,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Image source={{ uri: item.url }} className="rounded-xl w-full h-full" />
        <TouchableOpacity
          onPress={handleImageDelete(item._id)}
          className="absolute top-1 right-1 bg-black/60 rounded-full p-1"
        >
          <Ionicons name="close" size={22} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onLongPress={(e) => e.preventDefault()}
          className="absolute -bottom-1 -left-1 bg-black/60 opacity-70 rounded-full p-3 "
        >
          <MaterialCommunityIcons name="drag-variant" size={24} color="white" />
        </TouchableOpacity>
      </TouchableOpacity>
    ),
    [thumbnailSize]
  );

  const openImage = (index: number) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View className="px-2 py-8">
      <Sortable.Grid
        keyExtractor={(image) => image._id}
        columns={columns}
        data={images}
        renderItem={renderItem}
        rowGap={10}
        columnGap={15}
        onDragEnd={({ data }) => setImages(data)}
        scrollableRef={scrollRef} // required for auto scroll
        overflow='visible'
        autoScrollActivationOffset={75}
        autoScrollEnabled={true}
      />
      <Modal
        visible={modalVisible}
        transparent={false}
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

export default LobbyEditor;
