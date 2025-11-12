import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Toast } from "toastify-react-native";

export const pickImages = async (
  cb: (err: Error | null, newImages: ImageEntry[] | null) => Promise<void> | void,
) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Toast.error("Permission required: Please allow photo access to upload images.");
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    const formatPromises = result.assets.map(async (asset) => {
      const context = ImageManipulator.manipulate(asset.uri);
      context.resize({ height: 2000 });
      const image = await context.renderAsync();
      const result = await image.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.8,
      });
      return {
        _id: asset.assetId ?? asset.uri + Date.now(),
        url: result.uri,
      };
    });
    const newImages = await Promise.all(formatPromises);
    cb(null, newImages);
  }
};
