import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Toast } from 'toastify-react-native';

import Ionicons from '@expo/vector-icons/Ionicons';

import { handleReact } from '@/services/image';

const EMOJIS = ['😃', '😍', '😂', '😳', '🤪', '🕺'];

interface ReactionButtonProps {
  styles?: any;
  imageId: string;
  reactionString: string;
  initialReaction: string | null;
  onReact?: (likeType: string) => void;
}

const ReactionButton: React.FC<ReactionButtonProps> = ({
  styles: _styles,
  imageId,
  reactionString: initialReactionString,
  initialReaction,
  onReact,
}) => {
  const [selected, setSelected] = useState<string | null>(initialReaction);
  const [reactionString, setReactionString] = useState<string>(initialReactionString)
  const [menuVisible, setMenuVisible] = useState(false);
  const scaleAnim = new Animated.Value(0);

  const handleReactionRes = (
    reactionRes: { reactionString: string, userReaction: string | null } | null,
    err: Error | null,
  ) => {
    if (err || !reactionRes) {
      Toast.error('Failed to react to image');
      return;
    }
    setSelected(reactionRes?.userReaction);
    setReactionString(reactionRes?.reactionString);
    console.log('reactionRes:', reactionRes)
  };

  const handleLike = async () => {
    console.log('handle like')
    await handleReact(imageId, 'like', handleReactionRes);
    onReact?.('like');
  };

  const handleLongPress = () => {
    setMenuVisible(true);
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      useNativeDriver: true,
    }).start();
  };

  const handleSelectEmoji = async (emoji: string) => {
    await handleReact(imageId, emoji, handleReactionRes);
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
        delayLongPress={200}
        style={styles.button}
      >
        {selected ?
          <Ionicons name="heart-sharp" size={24} color="#f23232ff" />
          :
          <Ionicons name="heart-outline" size={24} color="black" />
        }
        <Text style={styles.buttonText}>
          {reactionString}
        </Text>
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
    alignItems: 'flex-start',
    justifyContent: 'center',
    width: 80,
  },
  button: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    elevation: 3,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 600,
    color: '#000',
  },
  menu: {
    position: 'absolute',
    bottom: 25,
    left: -10,
    width: 170,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
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

export default ReactionButton;

