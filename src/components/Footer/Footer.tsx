import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import {
  LiquidGlassView,
  LiquidGlassContainerView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import { Toast } from 'toastify-react-native';

import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { authClient } from '@/services/auth';
import ParensWrap from '@/components/ui/ParensWrap';

interface FooterProps {

}

const Footer: React.FC<FooterProps> = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();

  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const menuAnimation = useSharedValue(0);

  const handleSignOut = async () => {
    await authClient.signOut();
    router.push('/');
    Toast.info('Logged out');
  };

  const handleUserPress = () => {
    setUserMenuOpen(!userMenuOpen);
    menuAnimation.value = withTiming(userMenuOpen ? 0 : 1, {
      duration: 150,
      easing: Easing.ease,
    });
  };

  const animatedMenuStyles = useAnimatedStyle(() => {
    return {
      transform: [
        { translateY: menuAnimation.value * -100 },
        { scale: menuAnimation.value * 0.8 + 0.2 }, // Example: scale from 0.2 to 1
      ],
      opacity: menuAnimation.value,
    };
  });

  return (
    <View style={styles.footerContainer}>
      <Link href="/" asChild>
        <TouchableOpacity style={styles.footerButton}>
          <Image
            source={require('@/../assets/images/plurr-logo.png')}
            style={{ width: 102, height: 30 }}
            contentFit='contain'
          />
        </TouchableOpacity>
      </Link>
      <Link href="/my-lobbies" asChild>
        <TouchableOpacity style={styles.footerButton}>
          <ParensWrap>
            <FontAwesome6 name="images" size={24} color="black" />
          </ParensWrap>
        </TouchableOpacity>
      </Link>
      <Link href="/joined-lobbies" asChild>
        <TouchableOpacity style={styles.footerButton}>
          <ParensWrap>
            <MaterialCommunityIcons name="image-album" size={24} color="black" />
          </ParensWrap>
        </TouchableOpacity>
      </Link>
      {session ?
        <View style={styles.userContainer}>
          {userMenuOpen &&
            <Animated.View style={[styles.userMenu, animatedMenuStyles]}>
              <Link href="/" asChild>
                <TouchableOpacity style={styles.userMenuItem}>
                  <Text style={styles.menuText}>Settings</Text>
                </TouchableOpacity>
              </Link>
              <TouchableOpacity onPress={handleSignOut} style={styles.userMenuItem}>
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </Animated.View>
          }
          <TouchableOpacity onPress={handleUserPress} style={styles.footerButton}>
            <ParensWrap>
              <FontAwesome name="user" size={24} color="black" />
            </ParensWrap>
          </TouchableOpacity>
        </View> :
        <Link href="/login" asChild>
          <TouchableOpacity style={styles.footerButton}>
            <ParensWrap>
              <MaterialIcons name="login" size={24} color="black" />
            </ParensWrap>
          </TouchableOpacity>
        </Link>
      }
    </View>
  )
};

const styles = StyleSheet.create({
  footerContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 5,
    gap: 10,
  },
  footerButton: {
    backgroundColor: '#c1d7ee96',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 10,
  },
  userContainer: {
    position: 'relative',
  },
  userMenu: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    position: 'absolute',
    top: 0,
    right: 0,
    borderRadius: 5,
    width: 150,
    paddingVertical: 10,
    backgroundColor: '#ffffffcb',
  },
  userMenuItem: {
    paddingHorizontal: 15,
    paddingVertical: 8,

  },
  menuText: {
    fontSize: 20,
    fontFamily: 'AkkuratMono',
  }
});

export default Footer;
