import { createContext, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Slot } from "expo-router";

export const ValueContext = createContext(null);

export default function HomeLayout() {
  const [value, setValue] = useState("");
  return (
    <ValueContext.Provider value={{ value, setValue }}>
      <View style={styles.container}>
        <Slot />
      </View>
    </ValueContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
  },
});
