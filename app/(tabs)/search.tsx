import { useRouter } from "expo-router";
import ClientFindTasksScreen from "../../src/client/screen/clientFindTasksScreen";
import { NearbyTasksScreen } from "../../src/tasker/taskerTasksLayout/screen/nearbyTasksScreen";
import { getAuthSession } from "../../src/session";

export default function SearchRoute() {
  const router = useRouter();
  const session = getAuthSession();
  const isTasker = session?.role === "staff" || session?.role === "tasker";

  if (isTasker) {
    return (
      <NearbyTasksScreen
        onBack={() => router.replace("/(tabs)")}
        onNavigate={() => {}}
      />
    );
  }

  return <ClientFindTasksScreen />;
}
