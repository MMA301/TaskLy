import { Image, Pressable, Text, View } from "react-native";
import { Star } from "lucide-react-native";

type TaskerCardProps = {
  tasker?: {
    id?: number;
    name?: string;
    rating?: string;
    jobsCount?: string;
    skills?: string[];
    hourlyRate?: string;
    avatarUrl?: string;
  };
  name?: string;
  rating?: string;
  jobsCount?: string;
  skills?: string[];
  hourlyRate?: string;
  avatarUrl?: string;
  onBookPress?: () => void;
};

export default function TaskerCard({
  tasker,
  name,
  rating,
  jobsCount,
  skills,
  hourlyRate,
  avatarUrl,
  onBookPress,
}: TaskerCardProps) {
  const tName = tasker?.name || name || "Đối tác TaskLy";
  const tRating = tasker?.rating || rating || "5.0";
  const tJobsCount = tasker?.jobsCount || jobsCount || "100";
  const tSkills = tasker?.skills || skills || ["Dọn dẹp"];
  const tHourlyRate = tasker?.hourlyRate || hourlyRate || "100.000đ";
  const tAvatarUrl =
    tasker?.avatarUrl ||
    avatarUrl ||
    `https://api.dicebear.com/7.x/avataaars/png?seed=${tName}`;

  return (
    <View className="w-60 bg-white rounded-2xl p-4 mr-4 border border-slate-100 shadow-sm">
      <Image
        source={{ uri: tAvatarUrl }}
        className="w-14 h-14 rounded-full mb-2 bg-slate-100"
      />
      <Text className="text-base font-bold text-slate-900">{tName}</Text>
      <View className="flex-row items-center mt-1">
        <Star size={14} color="#EAB308" fill="#EAB308" />
        <Text className="text-indigo-600 font-bold ml-1 text-xs">
          {tRating}
        </Text>
        <Text className="text-slate-500 text-xs ml-2">
          {tJobsCount} công việc
        </Text>
      </View>

      <View className="flex-row flex-wrap mt-3 gap-1.5">
        {tSkills.map((skill) => (
          <View
            key={skill}
            className="bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100"
          >
            <Text className="text-indigo-700 text-xs font-medium">
              {skill}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row justify-between items-center mt-4 pt-3 border-t border-slate-100">
        <Text className="text-sm font-extrabold text-indigo-600">
          {tHourlyRate}/giờ
        </Text>
        <Pressable
          onPress={onBookPress}
          className="bg-indigo-600 px-3.5 py-1.5 rounded-full"
        >
          <Text className="text-white text-xs font-bold">Đặt lịch</Text>
        </Pressable>
      </View>
    </View>
  );
}
