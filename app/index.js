import { Pressable, Text } from "react-native";
import { Link } from "expo-router";

export default function Page() {
  return (
    <Link href="/chat" asChild>
      <Pressable>
        <Text>Let's Go!</Text>
      </Pressable>
    </Link>
  );
}
