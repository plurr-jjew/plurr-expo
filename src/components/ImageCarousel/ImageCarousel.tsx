import React, { useState, useRef } from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StatusBar,
  Text,
  useWindowDimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Entypo from '@expo/vector-icons/Entypo';

import { GradientBackground } from '@/components/ui/Gradients';

interface ImageCarouselProps {
  images: string[];
  backgroundColor: string;
  initialSelectedIndex: number;
  closeModal: () => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  backgroundColor,
  initialSelectedIndex,
  closeModal
}) => {
  const flatListRef = useRef<FlatList<string>>(null);
  const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = useWindowDimensions();

  const [selectedIndex, setSelectedIndex] = useState<number>(initialSelectedIndex);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: { index: number }[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index) {
      setSelectedIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderFullScreenImage = ({ item }: { item: string }) => (
    <View style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={{ uri: item }} style={{ width: SCREEN_WIDTH, height: SCREEN_HEIGHT }} resizeMode="contain" />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFF' }}>
      <GradientBackground color={backgroundColor} />
      <StatusBar hidden />
      <TouchableOpacity
        style={{ position: 'absolute', top: 50, right: 20, zIndex: 10, padding: 10, borderRadius: 25, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
        onPress={closeModal}
      >
        <Entypo name="back" size={32} color="white" style={{ opacity: 0.8 }}/>
      </TouchableOpacity>

      <View style={{ position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 10, paddingHorizontal: 16, borderRadius: 20, backgroundColor: 'rgba(0, 0, 0, 0.6)' }}>
        <Text style={{ color: 'white', opacity: 0.7, fontSize: 16, fontWeight: '600' }}>
          {selectedIndex + 1} / {images.length}
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={images}
        renderItem={renderFullScreenImage}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        initialScrollIndex={selectedIndex}
        getItemLayout={(data, index) => ({
          length: SCREEN_WIDTH,
          offset: SCREEN_WIDTH * index,
          index,
        })}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
      />
    </SafeAreaView>
  )
};

export default ImageCarousel;
