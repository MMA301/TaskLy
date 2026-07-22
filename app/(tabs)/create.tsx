import ClientCreateTaskScreen from "../../src/client/screen/clientCreateTaskScreen";
import { ClientRouteGuard } from "../../src/session/ClientRouteGuard";

export default function CreateRoute() {
  return (
    <ClientRouteGuard>
      <ClientCreateTaskScreen />
    </ClientRouteGuard>
  );
}
