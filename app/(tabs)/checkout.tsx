import ClientCheckoutScreen from "../../src/client/screen/clientCheckoutScreen";
import { ClientRouteGuard } from "../../src/session/ClientRouteGuard";

export default function CheckoutRoute() {
  return (
    <ClientRouteGuard>
      <ClientCheckoutScreen />
    </ClientRouteGuard>
  );
}
