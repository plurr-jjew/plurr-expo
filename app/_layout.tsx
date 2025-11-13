import 'react-native-gesture-handler';

import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import ToastManager from 'toastify-react-native';

import { authClient } from '@/services/auth';
import Button from '@/components/ui/Button';

import '../global.css';

export default function Layout() {
  const { data: session, isPending } = authClient.useSession();
  const header = (title: string | null, showImage: boolean, showLogin: boolean) => (
    <>
      <View className="flex flex-row justify-center items-center gap-2">
        {showImage ?
          <Image
            source={require('@/../assets/images/plurr-logo.png')}
            style={{ width: 85, height: 40 }}
            contentFit='contain'
          /> : null
        }
        {title ?
          <Text style={{
            fontFamily: 'dubsteptrix',
            fontSize: 16
          }}>
            {title}
          </Text> : null
        }
      </View>
      {!session && !isPending && showLogin ?
        <Link className="fixed right-0" href="/login" asChild>
          <Button
            variant="text"
            title="Login"
          />
        </Link> : null
      }
    </>
  );

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

  return (
    <>
      <GestureHandlerRootView>
        <Drawer>
          <Drawer.Screen
            name="index" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: () => <Image
                source={require('@/../assets/images/plurr-logo.png')}
                style={{ width: 100, height: 50 }}
                contentFit='contain'
              />,
              headerTitle: () => header('', false, true),
            }}
          />
          <Drawer.Screen
            name="new-lobby" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: () => <Text style={{ fontFamily: 'AkkuratMono' }}>Create Lobby</Text>,
              headerTitle: () => header('Create Lobby', true, false)
            }}
          />
          <Drawer.Screen
            name="my-lobbies" // This is the name of the page and must match the url from root
            options={{
              drawerLabel: () => <Text style={{ fontFamily: 'AkkuratMono' }}>My Lobbies</Text>,
              headerTitle: () => header('My Lobbies', true, true)
            }}
          />
          <Drawer.Screen
            name="lobby/[lobbyId]/edit" // This is the name of the page and must match the url from root
            options={{
              drawerItemStyle: { display: 'none' },
              headerTitle: () => header('', true, true)
            }}
          />
          <Drawer.Screen
            name="login"
            options={{
              drawerLabel: () => <Text style={{ fontFamily: 'AkkuratMono' }}>Login</Text>,
              drawerItemStyle: {
                display: session ? 'none' : 'flex',
                marginTop: 60,
              },
              headerTitle: () => header('Login', true, false)
            }}
          />
          <Drawer.Screen
            name="logout"
            options={{
              drawerLabel: () => <Text style={{ fontFamily: 'AkkuratMono' }} className="opacity-50">Logout</Text>,
              drawerItemStyle: {
                display: !session ? 'none' : 'flex',
                marginTop: 60,
              },
              headerTitle: () => header('', false, false),
              lazy: true,
            }}
          />
          <Drawer.Screen
            name="lobby/[lobbyId]/index"
            options={{
              drawerItemStyle: { display: 'none' },
              headerTitle: () => header('', true, true)
            }}
          />
        </Drawer>
      </GestureHandlerRootView>
      <ToastManager textStyle={{ fontFamily: 'AkkuratMono' }} useModal={false} />
    </>
  );
}