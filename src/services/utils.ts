import { Platform } from 'react-native';

import { authClient } from './auth';

export const getAuthRequestOptions = async (requestOptions: { [key: string]: object | string }) => {
  let cookies;
  if (Platform.OS === 'web') {
    cookies = await window.cookieStore.getAll();
    const { data: session, error } = await authClient.getSession();
    return {
      ...requestOptions,
      credentials: 'same-origin',
      headers: {
        'Authorization': `Bearer ${session?.session.token}`,
        'Content-Type': 'application/json',
      }
    };
  }
  else {
    cookies = authClient.getCookie();
    return {
      ...requestOptions,
      credentials: 'omit',
      headers: {
        'Cookie': cookies,
      }
    };
  }
};
