import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import IconButton from "../components/icon-button";
import { router } from "expo-router";
import { ValueContext } from "./_layout";

export default function App() {
  const { value, setValue } = React.useContext(ValueContext);
  const video = React.useRef(null);
  const [progress, setProgress] = React.useState(0);
  function goBack() {
    setValue("");
    router.replace("/");
  }
  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: value.uri,
        }}
        shouldPlay={true}
        useNativeControls={false}
        resizeMode={ResizeMode.COVER}
        isLooping={false}
        usePoster={true}
        onPlaybackStatusUpdate={(currentStatus) => {
          if (
            currentStatus.durationMillis !== null &&
            currentStatus.positionMillis !== null
          ) {
            setProgress(
              currentStatus.positionMillis / currentStatus.durationMillis
            );
          }
        }}
      />
      <View style={styles.progressBar}>
        <View style={[styles.progress, { width: `${progress * 100}%` }]} />
      </View>
      <IconButton
        size={30}
        icon={"close"}
        style={styles.closeButton}
        onPress={goBack}
      />
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: width,
    height: height,
  },
  progressBar: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    height: 5,
    width: "100%",
    backgroundColor: "transparent",
  },
  progress: {
    backgroundColor: "blue",
  },
  closeButton: {
    position: "absolute",
    bottom: 30,
  },
});
