import 'react-native-gesture-handler';

import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastManager from 'toastify-react-native';

import '../global.css';

export default function Layout() {
  return (
    <>
      <GestureHandlerRootView>
        <Slot />
      </GestureHandlerRootView>
      <ToastManager />
    </>
  );
}