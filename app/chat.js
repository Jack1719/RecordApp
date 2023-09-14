import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
} from "react-native-reanimated";

const audioRecorderPlayer = new AudioRecorderPlayer();
const MAX_BARS = 50; // Maximum number of bars in the graph

const AnimatedBar = ({ height }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      height,
    };
  });

  return (
    <Animated.View
      style={[
        {
          width: 2,
          backgroundColor: "blue",
          margin: 1,
        },
        animatedStyle,
      ]}
    />
  );
};

export default function App() {
  const [isRecording, setIsRecording] = useState(false);
  const animatedData = useSharedValue(Array(MAX_BARS).fill(0));

  const onStartRecord = async () => {
    const uri = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      const currentMetering = e.currentMetering;
      animatedData.value = [...animatedData.value, currentMetering];
      return;
    });
    setIsRecording(true);
  };

  const onStopRecord = async () => {
    await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={isRecording ? onStopRecord : onStartRecord}
      >
        <Text style={styles.buttonText}>
          {isRecording ? "Stop Recording" : "Start Recording"}
        </Text>
      </TouchableOpacity>

      <View style={{ flexDirection: "row", overflow: "hidden" }}>
        {animatedData.value.map((height, index) => (
          <AnimatedBar key={index} height={height} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 20,
    margin: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: "#fff",
  },
});
