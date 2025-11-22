import { Toast } from 'toastify-react-native';
import { fetch } from 'expo/fetch';

import { addImagesToFormData } from '@/utils/lobby';
import { getAuthRequestOptions } from './utils';

const hostname = process.env.EXPO_PUBLIC_API_URL;

declare global {
  interface LobbyEntry {
    _id: string;
    lobbyCode: string;
    createdOn: string;
    firstUploadOn: string | null;
    firstImageId?: string;
    ownerId: string;
    title: string;
    isJoined: boolean;
    viewersCanEdit: boolean;
    images: ImageEntry[];
    backgroundColor: string;
  }

  interface ImageEntry {
    _id: string;
    url: string;
    reactionString?: string;
    currentUserReaction?: string;
  }
}

/**
 * 
 * @param code 
 * @param cb 
 */
export const findLobbyByCode = async (
  code: string,
  cb: (id: string) => void
): Promise<void> => {
  try {
    const requestOptions = {
      method: 'GET',
    };
    const lobbyRes = await fetch(`${hostname}/lobby-id/code/${code}`, requestOptions);
    if (lobbyRes.status === 404) {
      Toast.error('Lobby not found');
      return;
    }
    if (lobbyRes.status === 200) {
      const lobbyId = await lobbyRes.json();
      if (cb) {
        cb(lobbyId);
      }
    }

  } catch (error) {
    console.error(error);
    Toast.error('Failed to get lobby info.');
  }
};

export const getUserLobbies = async (
  userId: string,
  cb: (err: Error | null, lobbyList: LobbyEntry[] | null) => void,
): Promise<void> => {
  try {
    const requestOptions = await getAuthRequestOptions({ method: 'GET' });

    const lobbyRes = await fetch(`${hostname}/lobby/user/${userId}`, requestOptions);
    if (lobbyRes.status !== 200) {
      cb(new Error('Failed to get lobbies'), null);
      return;
    }

    const lobbyList = await lobbyRes.json();
    cb(null, lobbyList);
  } catch (error) {
    console.error(error);
    cb(new Error('Failed to get lobbies'), null);
  }
};

export const getJoinedLobbies = async (
  userId: string,
  cb: (err: Error | null, lobbyList: LobbyEntry[] | null) => void,
): Promise<void> => {
  try {
    const requestOptions = await getAuthRequestOptions({ method: 'GET' });

    const lobbyRes = await fetch(`${hostname}/joined-lobbies`, requestOptions);
    if (lobbyRes.status !== 200) {
      cb(new Error('Failed to get lobbies'), null);
      return;
    }

    const lobbyList = await lobbyRes.json();
    cb(null, lobbyList);
  } catch (error) {
    console.error(error);
    cb(new Error('Failed to get lobbies'), null);
  }
};

/**
 * 
 * @param id 
 * @param cb 
 */
export const getLobbyData = async (
  id: string,
  cb: (err: Error | null, entry: LobbyEntry | null) => void
): Promise<void> => {
  try {
    const requestOptions = await getAuthRequestOptions({
      method: 'GET',
    });
    const lobbyRes = await fetch(`${hostname}/lobby/id/${id}`, requestOptions);
    if (lobbyRes.status === 404) {
      Toast.error('Lobby not found');
      cb(new Error('Lobby not found'), null);
      return;
    }
    if (lobbyRes.status === 200) {
      const lobbyData = await lobbyRes.json();
      cb(null, lobbyData);
    }
  } catch (error) {
    console.error(error);
    Toast.error('Failed to get lobby data.');
  }
};

export const createLobbyDraft = async (
  userId: string,
  title: string,
  backgroundColor: string,
  viewersCanEdit: boolean,) => {
  try {
    const formdata = new FormData();
    formdata.append('ownerId', userId);
    formdata.append('viewersCanEdit', viewersCanEdit.toString());
    formdata.append('title', title);
    formdata.append('backgroundColor', backgroundColor);

    const requestOptions = await getAuthRequestOptions({
      method: 'POST',
      body: formdata,
      'Content-Type': 'multipart/form-data',
    });

    const draftRes = await fetch(`${hostname}/lobby/draft`, requestOptions);
    const lobbyId = await draftRes.text();

    return lobbyId ? lobbyId : null;
  } catch (error) {
    console.error(error);
    Toast.error('Failed to create lobby.');
    return null;
  }
};

export const submitDraftLobby = async (
  lobbyId: string,
  userId: string,
  title: string,
  backgroundColor: string,
  viewersCanEdit: boolean,
  imageList: string[],
  removedImageList: string[],
) => {
  try {
    const formdata = new FormData();
    formdata.append('ownerId', userId);
    formdata.append('viewersCanEdit', viewersCanEdit.toString());
    formdata.append('title', title);
    formdata.append('backgroundColor', backgroundColor);
    formdata.append('isDraft', false.toString());
    formdata.append('images', JSON.stringify(imageList));
    formdata.append('deletedImages', JSON.stringify(removedImageList));

    const requestOptions = await getAuthRequestOptions({
      method: 'PUT',
      body: formdata,
    });

    const submitRes = await fetch(`${hostname}/lobby/id/${lobbyId}`, requestOptions);
    if (submitRes.status !== 200) {
      throw new Error('Server error');
    }
    return true;

  } catch (error) {
    console.error(error);
    Toast.error('Failed to submit lobby.');
    return false;
  }
};

/**
 * 
 * @param title 
 * @param images 
 * @param cb 
 */
export const submitNewLobby = async (
  userId: string,
  title: string,
  backgroundColor: string,
  viewersCanEdit: boolean,
  images: ImageEntry[],
  cb: (lobbyId: string) => void,
) => {
  try {
    const formdata = new FormData();
    formdata.append('ownerId', userId);
    formdata.append('viewersCanEdit', viewersCanEdit.toString());
    formdata.append('title', title);
    formdata.append('backgroundColor', backgroundColor);

    await addImagesToFormData(formdata, images);
    const requestOptions = await getAuthRequestOptions({
      method: 'POST',
      body: formdata,
      'Content-Type': 'multipart/form-data',
    });

    const submitRes = await fetch(`${hostname}/lobby`, requestOptions);
    const submitData = await submitRes.json();
    cb(submitData?.lobbyId);
    Toast.success('Created new lobby!');
  } catch (error) {
    console.error(error);
    Toast.error('Failed to create lobby.');
  }
};

/**
 * 
 * @param lobbyId 
 * @param title 
 * @param images
 * @param viewersCanEdit
 * @param deletedImages 
 */
export const updateLobbyEntry = async (
  lobbyId: string,
  title: string,
  images: ImageEntry[],
  viewersCanEdit: boolean,
  deletedImages: string[]
) => {
  try {
    const formdata = new FormData();
    formdata.append('title', title);
    formdata.append('images', JSON.stringify(images.map((image) => image._id)));
    formdata.append('viewersCanEdit', viewersCanEdit.toString());
    formdata.append('deletedImages', JSON.stringify(deletedImages));

    const requestOptions = await getAuthRequestOptions({
      method: 'PUT',
      body: formdata,
    });

    const updateRes = await fetch(`${hostname}/lobby/id/${lobbyId}`, requestOptions);
    Toast.success('Updated lobby sucessfully!')
  } catch (error) {
    console.error(error);
    Toast.error('Failed to update lobby.');
  }
};

/**
 * 
 * @param lobbyId 
 * @param images 
 * @param cb 
 * @returns 
 */
export const addImagesToLobby = async (
  lobbyId: string,
  images: ImageEntry[],
  cb: (err: Error | null, newImage: ImageEntry[] | null) => void,
) => {
  try {
    const formdata = new FormData();
    await addImagesToFormData(formdata, images);

    const requestOptions = await getAuthRequestOptions({
      method: 'PUT',
      body: formdata,
    });

    const updateRes = await fetch(`${hostname}/lobby/id/${lobbyId}/upload`, requestOptions);
    if (updateRes.status !== 200) {
      cb(new Error('Failed to add images'), null);
      return;
    }
    const newImageList = await updateRes.json();

    cb(
      null,
      newImageList.map((image: ImageEntry) => ({
        _id: image,
        reactionString: '0',
      }))
    );
  } catch (error) {
    console.error(error);
    Toast.error('Failed to add images.');
  }
};

export const joinLobby = async (
  lobbyId: string,
  cb: (err: Error | null, isJoined: boolean | null) => void
) => {
  try {
    const requestOptions = await getAuthRequestOptions({ method: 'PUT' });

    const lobbyRes = await fetch(`${hostname}/lobby/id/${lobbyId}/join`, requestOptions);
    if (lobbyRes.status !== 200) {
      cb(new Error('Failed to join lobby'), null);
      return;
    }

    const isJoined = await lobbyRes.json();
    cb(null, isJoined);
  } catch (error) {
    console.error(error);
    cb(new Error('Failed to join lobby'), null);
  }
};

export const deleteLobbyEntry = async (
  lobbyId: string,
  cb: (err: Error | null) => void,
) => {
  try {
    const requestOptions = await getAuthRequestOptions({ method: 'DELETE' });

    await fetch(`${hostname}/lobby/id/${lobbyId}`, requestOptions);
    cb(null);
  } catch (error) {
    console.error(error);
  }
};
