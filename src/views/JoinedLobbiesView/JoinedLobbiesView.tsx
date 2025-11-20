import React from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import LobbyGallery from '@/components/LobbyGallery/LobbyGallery';
import Button from '@/components/ui/Button';
import { GradientBackground } from '@/components/ui/Gradients';
import ParensWrap from '@/components/ui/ParensWrap';

interface MyLobbiesProps {
  lobbies: LobbyEntry[];
}

const JoinedLobbies: React.FC<MyLobbiesProps> = ({ lobbies }) => {
  return (
    <View style={styles.container}>
      <GradientBackground color="#a8d4f3ff" />
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Joined Lobbies</Text>
        {/* <Link href="/new-lobby" asChild>
          <TouchableOpacity style={styles.button}>
            <ParensWrap>
              <Text style={{ fontFamily: 'dubsteptrix'}}>+</Text>
              <FontAwesome6 name="images" size={24} color="black" />
            </ParensWrap>
          </TouchableOpacity>
        </Link> */}
      </View>
      <LobbyGallery lobbies={lobbies} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: Platform.OS === 'ios' || 'anrdroid' ? 70 : 0,
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
    fontFamily: 'dubsteptrix',
    fontSize: 30,
  }
});

export default JoinedLobbies;
