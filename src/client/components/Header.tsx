import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

type HeaderProps = {
  title: string;
  onProfilePress?: () => void;
};

export default function Header({ title, onProfilePress }: HeaderProps) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: Layout.spacing.md,
        paddingVertical: Layout.spacing.md,
        backgroundColor: Colors.surface,
      }}
    >
      <Text
        style={{ fontSize: 24, fontWeight: "700", color: Colors.onSurface }}
      >
        {title}
      </Text>
      <Pressable
        onPress={onProfilePress}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: Colors.surfaceContainer,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons
          name="person-circle-outline"
          size={24}
          color={Colors.primary}
        />
      </Pressable>
    </View>
  );
}
