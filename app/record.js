import { Camera, CameraType } from "expo-camera";
import { useState, useRef, useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import RecordButton from "../components/record-button";
import ToggleButton from "../components/toggle-button";
import IconButton from "../components/icon-button";
import { Link, router } from "expo-router";
import { ValueContext } from "./_layout";

export default function App() {
  const { setValue } = useContext(ValueContext);
  const [type, setType] = useState(CameraType.back);
  const [recordStatus, setRecordStatus] = useState("idle");
  const [micOn, setMicOn] = useState(false);
  const cameraRef = useRef(null);
  const [permissionCam, requestPermissionCam] = Camera.useCameraPermissions();
  const [permissionMic, requestPermissionMic] =
    Camera.useMicrophonePermissions();
  const [file, setFile] = useState(false);

  if (!permissionCam || !permissionMic) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permissionCam.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermissionCam} title="grant permission" />
      </View>
    );
  }
  if (!permissionMic.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to use your microphone
        </Text>
        <Button onPress={requestPermissionMic} title="grant permission" />
      </View>
    );
  }

  function toggleCameraType() {
    setType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  function handleRecordResult(uri) {
    setFile(uri);
    setValue(uri);
  }

  function sendVideo() {
    router.replace("/replay");
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.buttonContainer}>
          <View>
            {!file ? (
              <RecordButton
                size={70}
                cameraRef={cameraRef}
                handleResult={handleRecordResult}
                updateStatus={setRecordStatus}
                mute={!micOn}
              />
            ) : (
              <IconButton
                size={60}
                icon={"send"}
                iconColor="black"
                style={{ backgroundColor: "#fdca02" }}
                onPress={sendVideo}
              />
            )}
          </View>
          {recordStatus === "idle" && (
            <View style={styles.optionsContainer}>
              <ToggleButton
                onIcon={"mic"}
                offIcon={"mic-off"}
                onToggle={setMicOn}
                defaultValue={micOn}
              />
              <IconButton
                size={30}
                icon={"refresh-circle"}
                onPress={toggleCameraType}
              />
            </View>
          )}
          <Link href="/" asChild>
            <IconButton size={30} icon={"close"} style={styles.closeButton} />
          </Link>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },
  camera: {
    flex: 1,
    backgroundColor: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  optionsContainer: {
    position: "absolute",
    right: 10,
    gap: 10,
    flexDirection: "row",
  },
  closeButton: {
    position: "absolute",
    left: 10,
  },
});
