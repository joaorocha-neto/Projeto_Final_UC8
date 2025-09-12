import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  Animated,
  Text,
  TextInputProps,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface FloatingLabelInputProps extends TextInputProps {
  label: string;
  borderColor: string;
  nameIcon?: IoniconName;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  label,
  value,
  borderColor,
  nameIcon,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || !!value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const getIconColor = () => {
    if (isFocused) return "#004A8D";
    if (borderColor.includes("red")) return "#ef4444";
    return "#6b7280";
  };

  const iconColor = getIconColor();

  // Estilos animados continuam aqui
  const animatedLabelStyle = {
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [23, -8],
    }),
    left: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [nameIcon ? 48 : 16, 10],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [18, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#C9C9C9", isFocused ? "#004A8D" : "#333"],
    }),
  };

  const handleFocus = (e: any) => {
    setIsFocused(true);
    if (props.onFocus) props.onFocus(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    if (props.onBlur) props.onBlur(e);
  };

  return (
    // Usamos StyleSheet para o padding top
    <View style={styles.container}>
      <Animated.Text
        // Mesclamos os estilos base (estáticos) com os animados
        style={[styles.labelBase, animatedLabelStyle]}
      >
        {label}
      </Animated.Text>

      <View
        className={`bg-white rounded-lg border flex-row items-center ${borderColor}`}
      >
        {nameIcon && (
          <View style={styles.iconContainer}>
            <Ionicons name={nameIcon} size={22} color={iconColor} />
          </View>
        )}

        <TextInput
          {...props}
          value={value}
          // Mesclamos os estilos base do input com o padding dinâmico
          style={[styles.input, { paddingLeft: nameIcon ? 12 : 16 }]}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </View>
    </View>
  );
};

// Voltamos a usar StyleSheet para os estilos que não são classes do Tailwind
const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
  labelBase: {
    position: "absolute",
    paddingHorizontal: 4,
    zIndex: 10,
  },
  iconContainer: {
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    paddingRight: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
  },
});

export default FloatingLabelInput;
