import { useRouter } from "expo-router";
import { ReactNode, useEffect } from "react";
import { Text, View } from "react-native";
import { getAuthSession } from "./authSession";

type ClientRouteGuardProps = {
  readonly children: ReactNode;
};

export function ClientRouteGuard({ children }: ClientRouteGuardProps) {
  const router = useRouter();
  const session = getAuthSession();

  useEffect(() => {
    if (session?.role !== "client") {
      router.replace("/");
    }
  }, [router, session]);

  if (session?.role !== "client") {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-base text-slate-500 text-center">
          Trang này chỉ dành cho khách hàng. Vui lòng quay lại trang chính.
        </Text>
      </View>
    );
  }

  return <>{children}</>;
}
