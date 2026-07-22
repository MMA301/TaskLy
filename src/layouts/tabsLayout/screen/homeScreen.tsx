import ClientHomeScreen from "@/src/client/screen/clientHomeScreen";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AdminProfileScreen } from "../../../admin";
import { getAuthSession } from "../../../session";
import { TaskerHomeScreen } from "../../../tasker";

export function HomeScreen() {
  const router = useRouter();
  const session = getAuthSession();

  if (!session) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#1A102F",
          justifyContent: "center",
          padding: 24,
        }}
      >
        <Text
          style={{
            color: "#FFF",
            fontSize: 22,
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          Bạn chưa đăng nhập
        </Text>
        <Text
          style={{
            color: "#A78BFA",
            fontSize: 14,
            marginTop: 8,
            textAlign: "center",
          }}
        >
          Vui lòng đăng nhập để Taskly chọn đúng giao diện theo vai trò.
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/login")}
          style={{
            backgroundColor: "#8B5CF6",
            paddingVertical: 14,
            borderRadius: 12,
            alignItems: "center",
            marginTop: 24,
          }}
        >
          <Text style={{ color: "#FFF", fontWeight: "bold", fontSize: 16 }}>
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (session.role === "client") {
    return <ClientHomeScreen />;
  }

  if (session.role === "staff") {
    return <TaskerHomeScreen />;
  }

  return (
    <SafeAreaView
      className="flex-1 bg-[#111827]"
      edges={["top", "left", "right"]}
    >
      <AdminProfileScreen session={session} />
    </SafeAreaView>
  );
}
