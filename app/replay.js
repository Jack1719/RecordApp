import React from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import { Video, ResizeMode } from "expo-av";
import IconButton from "../components/icon-button";
import { Link } from "expo-router";
import { ValueContext } from "./_layout";

export default function App() {
  const { value } = React.useContext(ValueContext);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    if (status.didJustFinish) {
      video.current.replayAsync(); // Replay the video once it ends
    }
  }, [status]);

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          uri: value,
        }}
        shouldPlay={true}
        useNativeControls={false}
        resizeMode={ResizeMode.CONTAIN}
        isLooping={false}
        usePoster={true}
        onPlaybackStatusUpdate={(currentStatus) => {
          setStatus(currentStatus);
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
      <Link href="/" asChild>
        <IconButton size={30} icon={"close"} style={styles.closeButton} />
      </Link>
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
    flexDirection: "row",
    height: 10,
    width: "100%",
    backgroundColor: "grey",
    marginTop: 10,
  },
  progress: {
    backgroundColor: "blue",
  },
});
