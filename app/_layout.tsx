import React, { useEffect } from 'react';
import { Slot, usePathname } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Text, View, useWindowDimensions } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastManager from 'toastify-react-native';

import Footer from '@/components/Footer';

import '../global.css';

const hiddenFooterRoutes = ['/login'];

export default function Layout() {
  const { height: windowHeight } = useWindowDimensions();
  const currentPath = usePathname();

  const [loaded, error] = useFonts({
    'dubsteptrix': require('@/../assets/fonts/dubsteptrix.ttf'),
    'AkkuratMono': require('@/../assets/fonts/AkkuratMono-Regular.ttf')
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const hideFooter = hiddenFooterRoutes.includes(currentPath);

  return (
    <GestureHandlerRootView>
      <View style={{ height: windowHeight - 90 }}>
        <Slot />
      </View>
      <ToastManager useModal={false} />
      {!hideFooter && <Footer />}
    </GestureHandlerRootView>
  );
}
