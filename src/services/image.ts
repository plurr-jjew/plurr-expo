import { authClient } from './auth';
import { getAuthRequestOptions } from './utils';

// TO DO: implement endpoints corresponding to envs
const hostname = 'http://localhost:8787';

export const handleReact = async (
  imageId: string,
  reaction: string,
  cb: (reactionString: { reactionString: string, userReaction: string | null } | null, err: Error | null) => void,
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
    redirect: 'follow'
  });

  const reactRes = await fetch(`${hostname}/image/${imageId}/react`, requestOptions);
  const reactData = await reactRes.json();
  cb(reactData, null);
};
