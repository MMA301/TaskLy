import ClientJobDetailsScreen from "../../src/client/screen/clientJobDetailsScreen";
import { ClientRouteGuard } from "../../src/session/ClientRouteGuard";

export default function JobDetailsRoute() {
  return (
    <ClientRouteGuard>
      <ClientJobDetailsScreen />
    </ClientRouteGuard>
  );
}
