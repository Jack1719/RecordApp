import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ToggleButton({
  onPress = () => {},
  size = 30,
  icon,
  iconSize = 22,
  iconColor = "white",
  style = {},
}) {
  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onPress}
    >
      <Ionicons name={icon} size={iconSize} color={iconColor} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 99999,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
