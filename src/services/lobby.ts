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

const hostname = 'http://localhost:8787';

/**
 * 
 * @param code 
 * @param cb 
 */
export const findLobbyByCode = async (
  code: string,
  cb?: (id: string) => void
): Promise<void> => {
  try {
    const requestOptions = {
      method: 'GET',
    };
    const lobbyRes = await fetch(`${hostname}/lobby-id/code/${code}`, requestOptions);
    const lobbyId = await lobbyRes.json();
    if (cb) {
      cb(lobbyId);
    }

  } catch (error) {
    console.error(error);
  }
};

export const getLobbyData = async (
  id: string,
  cb: (entry: LobbyEntry) => void
): Promise<void> => {
  try {
    const requestOptions = {
      method: 'GET',
    };
    const lobbyRes = await fetch(`${hostname}/lobby/id/${id}`, requestOptions);
    const lobbyData = await lobbyRes.json();

    cb(lobbyData);

  } catch (error) {
    console.error(error);
  }
};


export const submitNewLobby = async (
  title: string,
  images: ImageEntry[],
  cb: (lobbyId: string) => void,
) => {
  try {
    const formdata = new FormData();
    formdata.append('ownerId', 'test');
    formdata.append('viewersCanEdit', 'true');
    formdata.append('title', title);

    const imagePromises = images.map(async (image, idx) => {
      const res = await fetch(image.url);
      const blob = await res.blob();
      const file = new File([blob], `image-${idx}.jpeg`, { type: "image/jpeg" });
      formdata.append(`image${idx}`, file);
    });
    await Promise.all(imagePromises);

    const requestOptions = {
      method: 'POST',
      body: formdata,
    };

    const submitRes = await fetch(`${hostname}/lobby`, requestOptions);
    const submitData = await submitRes.json();
    cb(submitData?.lobbyId);
  } catch (error) {
    console.error(error);
  }
};
