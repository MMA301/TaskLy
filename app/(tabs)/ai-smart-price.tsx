import ClientAISmartPriceScreen from "../../src/client/screen/clientAISmartPriceScreen";
import { ClientRouteGuard } from "../../src/session/ClientRouteGuard";

export default function AISmartPriceRoute() {
  return (
    <ClientRouteGuard>
      <ClientAISmartPriceScreen />
    </ClientRouteGuard>
  );
}
