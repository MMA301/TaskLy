import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import Colors from "../constants/Colors";
import Layout from "../constants/Layout";

type TaskerCardProps = {
  tasker: {
    id: number;
    name: string;
    rating: string;
    jobsCount: string;
    skills: string[];
    hourlyRate: string;
    avatarUrl: string;
  };
  onBookPress?: () => void;
};

export default function TaskerCard({ tasker, onBookPress }: TaskerCardProps) {
  return (
    <View
      style={{
        width: 240,
        backgroundColor: Colors.surface,
        borderRadius: Layout.borderRadius.md,
        padding: Layout.spacing.md,
        marginRight: Layout.spacing.md,
        borderWidth: 1,
        borderColor: Colors.outlineVariant,
      }}
    >
      <Image
        source={{ uri: tasker.avatarUrl }}
        style={{
          width: 56,
          height: 56,
          borderRadius: 28,
          marginBottom: Layout.spacing.sm,
        }}
      />
      <Text
        style={{ fontSize: 16, fontWeight: "700", color: Colors.onSurface }}
      >
        {tasker.name}
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}
      >
        <Ionicons name="star" size={14} color={Colors.star} />
        <Text
          style={{ color: Colors.primary, fontWeight: "600", marginLeft: 4 }}
        >
          {tasker.rating}
        </Text>
        <Text style={{ color: Colors.onSurfaceVariant, marginLeft: 8 }}>
          {tasker.jobsCount} công việc
        </Text>
      </View>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          marginTop: Layout.spacing.sm,
        }}
      >
        {tasker.skills.map((skill) => (
          <View
            key={skill}
            style={{
              backgroundColor: Colors.surfaceContainer,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: Layout.borderRadius.full,
              marginRight: 6,
              marginBottom: 6,
            }}
          >
            <Text style={{ color: Colors.onSurfaceVariant, fontSize: 12 }}>
              {skill}
            </Text>
          </View>
        ))}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: Layout.spacing.md,
        }}
      >
        <Text
          style={{ fontSize: 15, fontWeight: "700", color: Colors.primary }}
        >
          {tasker.hourlyRate}/giờ
        </Text>
        <Pressable
          onPress={onBookPress}
          style={{
            backgroundColor: Colors.primary,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: Layout.borderRadius.default,
          }}
        >
          <Text style={{ color: Colors.white, fontWeight: "600" }}>
            Đặt ngay
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
