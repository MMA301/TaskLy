import { Pressable, Text, View } from "react-native";
import { User } from "lucide-react-native";

type HeaderProps = {
  title: string;
  onProfilePress?: () => void;
};

export default function Header({ title, onProfilePress }: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-100">
      <Text className="text-2xl font-bold text-slate-900">
        {title}
      </Text>
      <Pressable
        onPress={onProfilePress}
        className="w-10 h-10 rounded-full bg-indigo-50 items-center justify-center border border-indigo-100"
      >
        <User size={20} color="#3525CD" />
      </Pressable>
    </View>
  );
}
