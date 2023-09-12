import { createContext, useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { Slot } from "expo-router";

export const ValueContext = createContext(null);

export default function HomeLayout() {
  const [value, setValue] = useState({
    uri: "",
    replaySetting: "allowReplay",
  });
  return (
    <ValueContext.Provider value={{ value, setValue }}>
      <SafeAreaView style={styles.container}>
        <Slot />
      </SafeAreaView>
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
