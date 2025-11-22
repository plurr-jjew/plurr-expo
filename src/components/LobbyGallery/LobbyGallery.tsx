import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  FlatList,
  useWindowDimensions
} from 'react-native';
import { Link } from 'expo-router';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { getTimeDifference } from '@/utils/datetime';

const hostname = process.env.EXPO_PUBLIC_API_URL;

type LobbyGalleryProps = {
  lobbies: LobbyEntry[]; // Array of image URIs (URLs)
  spacing?: number; // Spacing between images
};

const LobbyGallery: React.FC<LobbyGalleryProps> = ({ lobbies, spacing = 10 }) => {
  const { width: SCREEN_WIDTH } = useWindowDimensions();

  const thumbnailWidth = 165;
  const getColumns = () => {
    if (SCREEN_WIDTH >= thumbnailWidth * 5) return 5;
    if (SCREEN_WIDTH >= thumbnailWidth * 4) return 4;
    if (SCREEN_WIDTH >= thumbnailWidth * 3) return 3;
    if (SCREEN_WIDTH >= thumbnailWidth * 2) return 2;
    return 1;
  };

  const columns = getColumns();
  const thumbnailSize = (SCREEN_WIDTH - spacing * (columns + 1)) / columns - 10;

  const renderThumbnail = ({ item, index }: { item: LobbyEntry; index: number }) => (
    <Link href={`/lobby/${item._id}`} asChild>
      <TouchableOpacity
        style={{
          width: thumbnailSize,
          height: thumbnailSize,
          margin: spacing / 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 10,
          borderRadius: 8,
          backgroundColor: '#b5b5b5ff',
          overflow: 'hidden',
          boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
        }}
        activeOpacity={0.8}
      >
        {item.firstImageId ?
          <Image
            source={{ uri: `${hostname}/image/${item._id}/${item.firstImageId}` }}
            style={{ width: '100%', height: '100%' }}
            resizeMode="cover"
          /> :
          <>
            <MaterialIcons name="hide-image" size={40} color="white" />
            <Text style={{ fontFamily: 'dubsteptrix', color: '#454545ff' }}>
              Empty
            </Text>
          </>
        }
        <View style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: '#00000089',
          paddingLeft: 10,
          paddingRight: 15,
          paddingVertical: 10,
          borderTopRightRadius: 10,
        }}>
          <Text style={{
            color: '#FFF',
            fontWeight: 600,
            fontSize: 16,
            textAlign: 'left',
            fontFamily: 'AkkuratMono',
          }}>
            {item.title}
          </Text>
        </View>
        <View style={{
          position: 'absolute',
          top: 0,
          right: 0,
          backgroundColor: '#00000089',
          paddingLeft: 10,
          paddingRight: 15,
          paddingVertical: 10,
          borderTopRightRadius: 10,
        }}>
          <Text style={{
            color: '#FFF',
            fontWeight: 600,
            fontSize: 12,
            textAlign: 'left',
            fontFamily: 'AkkuratMono',
          }}>
            {getTimeDifference(item.createdOn, true)}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <FlatList
      key={`flatlist-${columns}cols`}
      style={{ paddingVertical: 10 }}
      data={lobbies}
      renderItem={renderThumbnail}
      keyExtractor={(item, index) => index.toString()}
      numColumns={columns}
      contentContainerStyle={{
        padding: spacing / 2,
      }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default LobbyGallery;
