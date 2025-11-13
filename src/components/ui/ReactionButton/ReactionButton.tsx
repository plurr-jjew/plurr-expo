import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

const EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '😡'];

export default function ReactionButton({ onReact, styles: _styles }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = new Animated.Value(0);

  const handleLike = () => {
    setSelected('👍');
    onReact?.('👍');
  };

  const handleLongPress = () => {
    setMenuVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectEmoji = (emoji: string) => {
    setSelected(emoji);
    onReact?.(emoji);
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setMenuVisible(false));
  };

  return (
    <View style={[styles.container, _styles]}>
      <TouchableOpacity
        onPress={handleLike}
        onLongPress={handleLongPress}
        style={styles.button}
      >
        {/* <Ionicons name="heart-sharp" size={24} color="black" /> */}
        <Ionicons name="heart-outline" size={24} color="white" />
        <Text style={styles.buttonText}>{selected || '👍'} 10</Text>
      </TouchableOpacity>

      {menuVisible && (
        <Animated.View
          style={[
            styles.menu,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {EMOJIS.map((emoji) => (
            <TouchableOpacity
              key={emoji}
              onPress={() => handleSelectEmoji(emoji)}
              style={styles.emojiOption}
            >
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: 'rgba(6, 6, 6, 0.65)ff',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderTopRightRadius: 15,
    paddingVertical: 10,
    paddingLeft: 10,
    paddingRight: 15,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#FFF',
  },
  menu: {
    position: 'absolute',
    bottom: 45,
    left: 0,
    width: 170,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    backgroundColor: '#00000087',
    borderRadius: 30,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  emojiOption: {
    marginHorizontal: 6,
  },
  emoji: {
    fontSize: 26,
  },
});
