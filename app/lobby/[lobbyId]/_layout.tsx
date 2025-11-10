import 'react-native-gesture-handler';

import { Slot } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export default function Layout() {
  return (
    <GestureHandlerRootView>
      <Slot />
    </GestureHandlerRootView>
  );
}