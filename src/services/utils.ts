import { Platform } from 'react-native';

import { authClient } from './auth';
import { FetchRequestInit } from 'expo/fetch';

export const getAuthRequestOptions = async (
  requestOptions?: { [key: string]: object | string },
  headers?: { [key: string]: string }
) => {
  if (Platform.OS === 'web') {
    const { data: session } = await authClient.getSession();
    const options: FetchRequestInit = {
      ...requestOptions,
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${session?.session.token}`,
        ...headers,
      }
    };
    return options;
  }
  else if (Platform.OS === 'ios' || Platform.OS === 'android') {
    const cookies = authClient.getCookie();
    const options: FetchRequestInit = {
      ...requestOptions,
      credentials: 'omit',
      headers: {
        'Cookie': cookies,
        ...headers,
      }
    };
    return options;
  }
  return ({
    ...requestOptions,
    headers,
  });
};
