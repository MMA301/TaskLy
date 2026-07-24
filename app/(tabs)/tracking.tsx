import { useRouter } from "expo-router";
import ClientTrackingScreen from "../../src/client/screen/clientTrackingScreen";
import { TaskHistoryScreen } from "../../src/tasker/taskerTasksLayout/screen/taskHistoryScreen";
import { getAuthSession } from "../../src/session";

export default function TrackingRoute() {
  const router = useRouter();
  const session = getAuthSession();
  const isTasker = session?.role === "staff" || session?.role === "tasker";

  if (isTasker) {
    return (
      <TaskHistoryScreen
        onBack={() => router.replace("/(tabs)")}
        onNavigate={() => {}}
      />
    );
  }

  return <ClientTrackingScreen />;
}
