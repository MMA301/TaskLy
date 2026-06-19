import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Zap } from 'lucide-react-native';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    // Tự động chuyển trang sang Onboarding sau 2.5 giây
    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2500);
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <LinearGradient
      colors={['#5B21B6', '#2E1065']}
      className="flex-1 justify-center items-center"
    >
      <View className="items-center justify-center">
        {/* Brand Logo Container */}
        <View className="shadow-2xl shadow-black/30">
          <LinearGradient
            colors={['#8B5CF6', '#6D28D9']}
            className="w-[100px] h-[100px] rounded-[24px] justify-center items-center relative"
          >
            <Text className="text-[56px] font-black text-white">M</Text>
            {/* Upper right dot inside logo */}
            <View className="absolute top-[22px] right-[22px] w-[10px] h-[10px] rounded-full bg-[#818CF8]" />
          </LinearGradient>
        </View>

        {/* Brand Name */}
        <Text className="text-[36px] font-bold text-white mt-[18px] tracking-[0.5px]">Taskly</Text>
      </View>

      {/* Footer Element */}
      <View className="absolute bottom-[60px] items-center">
        <View className="w-[44px] h-[44px] rounded-full bg-white/10 border-[1.5px] border-white/20 justify-center items-center mb-[12px]">
          <Zap size={20} color="#FFF" />
        </View>
        <Text className="text-[13px] text-white/70 font-medium tracking-[0.2px]">Kết nối việc nhanh, làm ngay tại chỗ</Text>
      </View>
    </LinearGradient>
  );
}
