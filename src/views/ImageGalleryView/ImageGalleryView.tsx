import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router';
import { Toast } from 'toastify-react-native';
import QRCode from 'react-native-qrcode-svg';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { addImagesToLobby } from '@/services/lobby';
import { pickImages } from '@/utils/imagePicker';
import ImageGallery from '@/components/ImageGallery';
import Button from '@/components/ui/Button';
import ExpandableModal from '@/components/ExpandableModal';
import IconButton from '@/components/ui/IconButton';
import LoadingOverlay from '@/components/ui/LoadingOverlay';

interface ImageGalleryViewProps {
  _id: string;
  createdOn: string;
  firstUploadOn: string | null;
  ownerId: string;
  title: string;
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
  lobbyCode,
  initialImages,
  viewersCanEdit,
}) => {
  const [images, setImages] = useState<ImageEntry[]>(initialImages);
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
  // console.log('imagegalleryview', initialImages, images)

  return (
    <View className="relative flex justify-center items-center flex-1 px-2 py-6 bg-white gap-2">
      <LoadingOverlay show={loading} />
      <Text style={styles.titleText}>{title}</Text>

      <ImageGallery images={images.map((image) => `${hostname}/image/${_id}/${image._id}`)} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'AkkuratMono',
    fontSize: 24,
    fontWeight: 600,
    textAlign: 'center',
    paddingVertical: 10,
  }
});

export default ImageGalleryView;
