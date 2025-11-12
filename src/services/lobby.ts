import { Toast } from 'toastify-react-native';

import { addImagesToFormData } from '@/utils/lobby';

declare global {
  interface LobbyEntry {
    _id: string;
    lobbyCode: string;
    createdOn: string;
    firstUploadOn: string;
    ownerId: string;
    title: string;
    viewersCanEdit: boolean;
    images: ImageEntry[];
  }

  interface ImageEntry {
    _id: string;
    url: string;
    reactionString?: string;
  }
}

// TO DO: implement endpoints corresponding to envs
const hostname = 'http://localhost:8787';

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
    const requestOptions = {
      method: 'GET',
    };
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

/**
 * 
 * @param title 
 * @param images 
 * @param cb 
 */
export const submitNewLobby = async (
  title: string,
  viewersCanEdit: boolean,
  images: ImageEntry[],
  cb: (lobbyId: string) => void,
) => {
  try {
    const formdata = new FormData();
    formdata.append('ownerId', 'test');
    formdata.append('viewersCanEdit', viewersCanEdit.toString());
    formdata.append('title', title);

    await addImagesToFormData(formdata, images);

    const requestOptions = {
      method: 'POST',
      body: formdata,
    };

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

    const requestOptions = {
      method: 'PUT',
      body: formdata,
    };

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

    const requestOptions = {
      method: 'PUT',
      body: formdata,
    };

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

export const deleteLobbyEntry = async (
  lobbyId: string,
  cb: (err: Error | null) => void, 
) => {
  try {
    const requestOptions = {
      method: 'DELETE',
    };

    await fetch(`${hostname}/lobby/id/${lobbyId}`, requestOptions);
    cb(null);
  } catch(error) {
    console.error(error);
  }
};

