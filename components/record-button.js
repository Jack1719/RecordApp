import React, { useCallback, useMemo, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

const AnimatedPath = Animated.createAnimatedComponent(Path);

const RecordButton = ({ size = 100 }) => {
  const [isRecording, setIsRecording] = useState(false);
  const progress = useSharedValue(0);

  const radius = size / 2 - 2;
  const circumference = radius * 2 * Math.PI;

  const animatedProps = useAnimatedProps(() => {
    const strokeDashoffset = circumference * (1 - progress.value);
    return {
      strokeDashoffset,
    };
  });

  const handlePress = useCallback(() => {
    setIsRecording((prevState) => {
      if (!prevState) {
        progress.value = withTiming(1, { duration: 30000 });
      } else {
        progress.value = 0;
      }
      return !prevState;
    });
  }, [setIsRecording]);
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
});

export default RecordButton;
