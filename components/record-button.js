import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Camera } from "expo-camera";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const RecordButton = ({
  size = 70,
  time = 30,
  cameraRef,
  mute = false,
  handleResult = (uri) => {},
  updateStatus = (status) => {},
}) => {
  const [isRecording, setIsRecording] = useState(() => {
    updateStatus("idle");
    return false;
  });
  const progress = useSharedValue(0);
  const [timeText, setTimeText] = useState("00:30");
  const intervalHandle = useRef(null);

  useEffect(() => {
    return () =>
      intervalHandle.current && clearInterval(intervalHandle.current);
  }, []);

  const radius = size / 2 - 2;
  const circumference = radius * 2 * Math.PI;

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = (circumference * (time - progress.value)) / time;
    return {
      strokeDashoffset,
    };
  });
  const handleEnd = (uri = "") => {
    intervalHandle.current && clearInterval(intervalHandle.current);
    progress.value = 0;
    setIsRecording(false);
    setTimeText("00:" + time);
    if (uri) {
      updateStatus("stopped");
      handleResult(uri);
    } else {
      updateStatus("idle");
    }
  };
  const handlePress = () => {
    if (!isRecording) {
      if (cameraRef.current) {
        intervalHandle.current = setInterval(() => {
          const seconds = time - Math.ceil(progress.value);
          setTimeText(`00:${seconds.toString().padStart(2, "0")}`);
        }, 1000);
        progress.value = withTiming(time, { duration: 30000 });
        updateStatus("recording");
        setIsRecording(true);
        cameraRef.current
          .recordAsync({
            quality: Camera.Constants.VideoQuality["720p"], // You can set quality
            maxDuration: time, // You can set a maximum duration (in seconds)
            mute, // mute the recording
          })
          .then((data) => {
            handleEnd(data.uri);
          })
          .catch(() => {
            handleEnd();
          });
      }
    } else {
      if (cameraRef.current) {
        cameraRef.current.stopRecording();
      }
    }
  };
  const containerStyle = useMemo(() => {
    return [styles.container, { width: size, height: size }];
  }, [size]);

  const innerViewSize = isRecording ? (size - 4) / 2 : size - 12;
  const dynamicStyles = {
    innerView: {
      width: innerViewSize,
      height: innerViewSize,
      borderRadius: isRecording ? 0 : radius - 4,
      transform: [
        { translateX: -innerViewSize / 2 },
        { translateY: -innerViewSize / 2 },
      ],
    },
  };

  return (
    <View style={styles.center}>
      <Text style={styles.countdownText}>{timeText}</Text>
      <TouchableOpacity onPress={handlePress}>
        <View style={containerStyle}>
          <Svg width={size} height={size}>
            <Path
              d={`M ${size / 2},${
                size / 2
              } m 0,-${radius} a ${radius},${radius} 0 1,1 0,${
                2 * radius
              } a ${radius},${radius} 0 1,1 0,-${2 * radius}`}
              stroke="white"
              strokeWidth="2"
              fill="none"
            />
            {isRecording && (
              <AnimatedPath
                d={`M ${size / 2},${
                  size / 2
                } m 0,-${radius} a ${radius},${radius} 0 1,1 0,${
                  2 * radius
                } a ${radius},${radius} 0 1,1 0,-${2 * radius}`}
                stroke="red"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                animatedProps={animatedProps}
                strokeDasharray={`${circumference}, ${circumference}`}
              />
            )}
          </Svg>
          <View style={[styles.innerView, dynamicStyles.innerView]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    position: "relative",
  },
  innerView: {
    position: "absolute",
    top: "50%",
    left: "50%",
    backgroundColor: "white",
  },
  countdownText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
});

export default RecordButton;
