import { Pressable, Text } from "react-native";
import Colors from "../constants/Colors";

type ButtonProps = {
  title: string;
  onPress?: () => void;
};

export default function Button({ title, onPress }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: "center",
      }}
    >
      <Text style={{ color: Colors.white, fontWeight: "700", fontSize: 15 }}>
        {title}
      </Text>
    </Pressable>
  );
}
