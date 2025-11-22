import * as ImagePicker from "expo-image-picker";
import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { Toast } from "toastify-react-native";

export const pickImages = async (
  cb?: (err: Error | null, newImages: ImageEntry[] | null) => Promise<void> | void,
) => {
  const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permissionResult.granted) {
    Toast.error("Permission required: Please allow photo access to upload images.");
    return null;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 1,
  });

  if (!result.canceled) {
    const formatPromises = result.assets.map(async (asset, index) => {
      const context = ImageManipulator.manipulate(asset.uri);
      const beforeImage = await context.renderAsync();
      if (beforeImage.width > 1500) {
        context.resize({ width: 1500 });
      }

      const newImage = await context.renderAsync();
      const result = await newImage.saveAsync({
        format: SaveFormat.JPEG,
        compress: 0.6,
      });
      return {
        _id: asset.assetId ? `${asset.assetId}_${Date.now()}` : `image${index}_${Date.now()}`,
        url: result.uri,
      };
    });
    return await Promise.all(formatPromises);
  }
  return null;
};
