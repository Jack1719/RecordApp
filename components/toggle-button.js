import * as React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function ToggleButton({
  size = 30,
  onIcon,
  offIcon,
  defaultValue = true,
  onToggle = (value) => {},
  style = {},
}) {
  const [isOn, setIsOn] = React.useState(defaultValue);
  const onToggleHandler = React.useCallback(() => {
    setIsOn((prev) => {
      onToggle(!prev);
      return !prev;
    });
  }, [onToggle]);

  return (
    <TouchableOpacity
      style={[styles.container, { width: size, height: size }, style]}
      onPress={onToggleHandler}
    >
      <Ionicons
        name={`${isOn ? onIcon : offIcon}`}
        size={size - 8}
        color="white"
      />
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
