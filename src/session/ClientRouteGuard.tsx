import { router } from "expo-router";
import { ReactNode, useEffect } from "react";
import { Text, View } from "react-native";
import { getAuthSession } from "./authSession";

type ClientRouteGuardProps = {
  readonly children: ReactNode;
};

export function ClientRouteGuard({ children }: ClientRouteGuardProps) {
  const session = getAuthSession();

  const isClientRole =
    !session ||
    session.role === "client" ||
    (session as any)?.role === "customer";

  useEffect(() => {
    if (!isClientRole) {
      router.replace("/");
    }
  }, [isClientRole]);

  if (!isClientRole) {
    return (
      <View className="flex-1 justify-center items-center px-6 bg-slate-50">
        <Text className="text-base text-slate-500 text-center">
          Trang này chỉ dành cho khách hàng. Vui lòng quay lại trang chính.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
