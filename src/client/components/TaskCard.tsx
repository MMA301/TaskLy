import { Image, Pressable, Text, View } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

type TaskCardProps = {
  task: {
    id: number;
    category: string;
    title: string;
    description: string;
    distance: string;
    rating: string;
    budget: string;
    avatarUrl: string;
  };
  onPress?: () => void;
};

export default function TaskCard({ task, onPress }: TaskCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        backgroundColor: Colors.surface,
        borderRadius: Layout.borderRadius.md,
        padding: Layout.spacing.md,
        marginBottom: Layout.spacing.md,
        borderWidth: 1,
        borderColor: Colors.outlineVariant,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: task.avatarUrl }}
          style={{
            width: 48,
            height: 48,
            borderRadius: 24,
            marginRight: Layout.spacing.md,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{ fontSize: 15, fontWeight: "700", color: Colors.onSurface }}
          >
            {task.title}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: Colors.onSurfaceVariant,
              marginTop: 2,
            }}
          >
            {task.category}
          </Text>
        </View>
        <Text
          style={{ fontSize: 13, fontWeight: "700", color: Colors.primary }}
        >
          {task.budget}
        </Text>
      </View>
      <Text
        style={{
          color: Colors.onSurfaceVariant,
          marginTop: Layout.spacing.sm,
          fontSize: 13,
        }}
      >
        {task.description}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: Layout.spacing.sm,
        }}
      >
        <Text style={{ fontSize: 12, color: Colors.onSurfaceVariant }}>
          {task.distance}
        </Text>
        <Text
          style={{ fontSize: 12, color: Colors.primary, fontWeight: "600" }}
        >
          {task.rating} ★
        </Text>
      </View>
    </Pressable>
  );
}
