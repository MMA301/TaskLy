import ClientFindTasksScreen from "../../src/client/screen/clientFindTasksScreen";
import { ClientRouteGuard } from "../../src/session/ClientRouteGuard";

export default function SearchRoute() {
  return (
    <ClientRouteGuard>
      <ClientFindTasksScreen />
    </ClientRouteGuard>
  );
}
