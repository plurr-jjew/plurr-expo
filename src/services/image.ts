import { Platform } from 'react-native';
import { fetch } from 'expo/fetch';
import { File as ExpoFile, Paths } from 'expo-file-system';

import { authClient } from './auth';
import { getAuthRequestOptions } from './utils';

const hostname = process.env.EXPO_PUBLIC_API_URL;

export const uploadImage = async (
  image: ImageEntry,
  lobbyId: string,
) => {
  const formData = new FormData();
  let file;

  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    file = new ExpoFile(image.url);
  } else {
    const res = await fetch(image.url);
    const blob = await res.blob();
    file = new File([blob], `image.jpeg`, { type: 'image/jpeg' });
  }
  formData.append('image', file);

  const requestOptions = await getAuthRequestOptions({
    method: 'POST',
    body: formData,
  });
  const imageRes = await fetch(`${hostname}/image/lobby-id/${lobbyId}`, requestOptions);
  const imageId = await imageRes.text();
  return imageId;
};

export const handleReact = async (
  imageId: string,
  reaction: string,
  cb: (reactionString: { updatedReactionString: string, userReaction: string | null } | null, err: Error | null) => void,
): Promise<void> => {
  const { data: session, error } = await authClient.getSession();
  if (!session) {
    cb(null, new Error('Not Authenticated'));
    return;
  }

  const formdata = new FormData();
  formdata.append('reaction', reaction);
  formdata.append('userId', session.user.id);

  const requestOptions = await getAuthRequestOptions({
    method: 'PUT',
    body: formdata,
  });

  const reactRes = await fetch(`${hostname}/image/${imageId}/react`, requestOptions);
  const reactData = await reactRes.json();
  cb(reactData, null);
};
