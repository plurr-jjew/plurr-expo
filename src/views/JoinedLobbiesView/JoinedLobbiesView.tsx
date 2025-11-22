import React from 'react';
import { StyleSheet, View, Text, Platform, } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';

import LobbyGallery from '@/components/LobbyGallery/LobbyGallery';
import { GradientBackground } from '@/components/ui/Gradients';

interface MyLobbiesProps {
  lobbies: LobbyEntry[];
}

const JoinedLobbies: React.FC<MyLobbiesProps> = ({ lobbies }) => {
  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <GradientBackground color="#a8d4f3ff" />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Joined Lobbies</Text>
      </View>
      <LobbyGallery lobbies={lobbies} />
    </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: Platform.OS === 'web' ? 30 : 10,
    flex: 1,
  },
  headerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    flexDirection: 'row',
    marginBottom: 5,
  },
  button: {
    backgroundColor: '#c1d7ee96',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    height: 50,
    borderRadius: 10,
  },
  title: {
    fontFamily: 'AkkuratMono',
    fontSize: 30,
  }
});

export default JoinedLobbies;
