import React, { useState } from 'react';
import { Text, View, StyleSheet, } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, Link } from 'expo-router';
import { Toast } from 'toastify-react-native';

import { findLobbyByCode } from '@/services/lobby';
import { authClient } from '@/services/auth';

import Button from '@/components/ui/Button';
import TextInput from '@/components/ui/TextInput';
import { GradientBackground } from '@/components/ui/Gradients';
import VerticalSlider from '@/components/ui/VerticalSlider';
import ParensWrap from '@/components/ui/ParensWrap';
import { FloatingComponent } from '@/components/animations';

const HomeView = () => {
  const router = useRouter();

  const [hValue, setHValue] = useState<number>(40);
  const [sValue, setSValue] = useState<number>(77);
  const [vValue, setVValue] = useState<number>(90);

  const [lobbyCode, setLobbyCode] = useState<string>('');

  const handleJoinLobby = () => {
    if (/^[A-Za-z0-9]{6}$/.test(lobbyCode)) {
      findLobbyByCode(
        lobbyCode,
        (lobbyId) => router.push(`/lobby/${lobbyId}`)
      );
    } else {
      Toast.error('Please enter valid code');
    }
  };
  
  return (
    <View style={styles.container}>
      <GradientBackground hValue={hValue} sValue={sValue} vValue={vValue} />
      <View style={{ position: 'absolute', top: 60, left: 30, zIndex: 1000 }}>
        <FloatingComponent>
          <ParensWrap>
            <Text style={{ fontSize: 24 }}>
              🍓
            </Text>
          </ParensWrap>
        </FloatingComponent>
      </View>
      <View style={styles.sliderContainer}>
        <VerticalSlider
          width={15}
          height={170}
          value={hValue}
          onChange={(newH) => setHValue(newH)}
          min={0}
          max={360}
          step={1}
          showIndicator
          indicatorLabel="H"
        />
        <VerticalSlider
          width={15}
          height={170}
          value={sValue}
          onChange={(newS) => setSValue(newS)}
          min={0}
          max={100}
          step={1}
          showIndicator
          indicatorLabel="S"
        />
        <VerticalSlider
          width={15}
          height={170}
          value={vValue}
          onChange={(newV) => setVValue(newV)}
          min={0}
          max={100}
          step={1}
          showIndicator
          indicatorLabel="V"
        />
      </View>
      {/* <Image
        source={require('@/../assets/images/plurr-logo.png')}
        style={{ width: 200, height: 100 }}
        contentFit='contain'
      />
      <Text style={{
        fontFamily: 'dubsteptrix',
        textAlign: 'center',
        fontSize: 18,
        marginBottom: 50,
      }}>
        Do Now.{`\n`}
        Connect Later.
      </Text> */}
      <View style={styles.lobbyContainer}>
        <TextInput
          className="mb-4"
          label="Lobby Code"
          placeholder="ABC123"
          value={lobbyCode}
          maxLength={6}
          onChangeText={setLobbyCode}
          hasButton
          buttonTitle='Join'
          onButtonPress={handleJoinLobby}
        />
        <Link
          href={{
            pathname: '/new-lobby',
            params: { h: hValue, s: sValue, v: vValue }
          }}
          asChild
        >
          <Button
            className="mt-8"
            fullWidth
            title="Host Lobby"
          />
        </Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    display: 'flex',
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: '#e0e0e0ff',
  },
  sliderContainer: {
    marginTop: 80,
    marginBottom: 80,
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    gap: 80,
  },
  lobbyContainer: {
    width: 250,
  }
});

export default HomeView;
