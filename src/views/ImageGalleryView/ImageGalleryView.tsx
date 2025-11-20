import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Link } from 'expo-router';
import { Toast } from 'toastify-react-native';
import QRCode from 'react-native-qrcode-svg';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';

import { addImagesToLobby, joinLobby } from '@/services/lobby';
import { pickImages } from '@/utils/imagePicker';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/ui/Button';
import ExpandableModal from '@/components/ExpandableModal';
import IconButton from '@/components/ui/IconButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';
import { GradientBackground } from '@/components/ui/Gradients';

interface ImageGalleryViewProps {
  _id: string;
  createdOn: string;
  firstUploadOn: string | null;
  ownerId: string;
  title: string;
  isJoined: boolean;
  backgroundColor: string;
  lobbyCode: string;
  initialImages: ImageEntry[];
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
  isJoined: initialIsJoined,
  backgroundColor,
  lobbyCode,
  initialImages,
  viewersCanEdit,
}) => {
  const [images, setImages] = useState<ImageEntry[]>(initialImages);
  const [isJoined, setIsJoined] = useState<boolean>(initialIsJoined);
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCodeOpen, setQrCodeOpen] = useState<boolean>(false);

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

  const handleJoin = async () => {
    await joinLobby(_id, (err, newIsJoined) => {
      if (err || typeof newIsJoined !== 'boolean') {
        Toast.error('Failed to join lobby');
        return;
      }
      setIsJoined(newIsJoined);
    });
  }

  return (
    <View style={styles.container}>
      <LoadingOverlay show={loading} />
      <GradientBackground color={backgroundColor} />
      <Text style={styles.titleText}>{title}</Text>
      <View className="flex flex-row gap-20 mb-3 justify-center align-center">
        <Link href={`/lobby/${_id}/edit`} asChild>
          <IconButton Icon={<MaterialIcons name="edit-note" size={24} color="black" />} />
        </Link>
        <IconButton
          Icon={<MaterialCommunityIcons name="image-plus" size={24} color="black" />}
          onPress={handleAddImages}
        />
        <IconButton
          onPress={() => setQrCodeOpen(true)}
          Icon={<MaterialIcons name="qr-code-2" size={24} color="black" />}
        />
        <IconButton
          onPress={handleJoin}
          Icon={isJoined ?
            <FontAwesome name="bookmark" size={24} color="black" /> :
            <FontAwesome name="bookmark-o" size={24} color="black" />
          }
        />
      </View>
      <ExpandableModal
        visible={qrCodeOpen}
        onClose={() => setQrCodeOpen(false)}

      >
        <QRCode
          value={`plurr.it/lobby/${_id}`}
        // logo={require('@/../assets/images/plurr-logo.png')}
        />
      </ExpandableModal>

      <ImageGallery
        images={images.map((image) => ({
          ...image,
          url: `${hostname}/image/${_id}/${image._id}`,
        }))}
        backgroundColor={backgroundColor}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'web' ? 20 : 55
  },
  titleText: {
    fontFamily: 'AkkuratMono',
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
    paddingVertical: 10,
  }
});

export default ImageGalleryView;
