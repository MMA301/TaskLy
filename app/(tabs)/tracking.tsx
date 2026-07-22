import ClientTrackingScreen from "../../src/client/screen/clientTrackingScreen";
import { ClientRouteGuard } from "../../src/session/ClientRouteGuard";

export default function TrackingRoute() {
  return (
    <ClientRouteGuard>
      <ClientTrackingScreen />
    </ClientRouteGuard>
  );
}
