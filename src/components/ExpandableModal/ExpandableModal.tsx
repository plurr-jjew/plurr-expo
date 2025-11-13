import React, { useEffect, useRef } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native";

interface ExpandableModalProps {
  visible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  containerStyle?: ViewStyle;
}

const ExpandableModal: React.FC<ExpandableModalProps> = ({
  visible,
  onClose,
  children,
  containerStyle,
}) => {
  const scale = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.spring(scale, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scale, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View style={[styles.backdrop, { opacity: fade }]} />
      </TouchableWithoutFeedback>

      {/* Centered content */}
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.modalContainer,
            containerStyle,
            { transform: [{ scale }] },
          ]}
        >
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ExpandableModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    elevation: 10,
  },
});
